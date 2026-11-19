import {createServerFn} from '@tanstack/react-start';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {z} from 'zod';
async function assertAdmin(context:{supabase:any;userId:string}){const {data}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});if(!data)throw new Error('Forbidden');}
function friendly(e:unknown):never{const name=(e as {name?:string})?.name??'';console.error('AI generation failed',e);if(name==='PaymentRequiredError')throw new Error('AI credits are exhausted. Add credits to continue generating.');if(name==='RateLimitError')throw new Error('The AI service is busy. Wait a minute and try again.');throw new Error(e instanceof Error&&e.message?`AI generation failed: ${e.message}`:'AI generation failed.');}
const slideJson={type:'object',additionalProperties:false,required:['slides'],properties:{slides:{type:'array',items:{type:'object',additionalProperties:false,required:['title_ar','body_ar','speaker_notes_ar','layout','photo_query_en','image_prompt_en'],properties:{photo_query_en:{type:'string'},title_ar:{type:'string'},body_ar:{type:'string'},speaker_notes_ar:{type:'string'},layout:{type:'string',enum:['split','statement','spotlight','image']},image_prompt_en:{type:'string'}}}}}};
export const generateStudentSlides=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((i:{studentId:string})=>z.object({studentId:z.string().uuid()}).parse(i)).handler(async({data,context})=>{await assertAdmin(context);const sb=context.supabase;
 const {data:s,error}=await sb.from('students').select('*').eq('id',data.studentId).single();if(error)throw error;
 const {data:p}=await sb.from('projects').select('*').eq('id',s.project_id).single();if(!p)throw new Error('Project not found');
 let {data:deck}=await sb.from('presentations').select('*').eq('student_id',s.id).maybeSingle();if(!deck){const r=await sb.from('presentations').insert({student_id:s.id}).select('*').single();deck=r.data;}if(!deck)throw new Error('Presentation could not be created');
 const {data:existing}=await sb.from('slides').select('slide_order,title_ar').eq('presentation_id',deck.id).order('slide_order');
 const missing=s.requested_slide_count-(existing?.length??0);if(missing<=0)return {created:[] as string[]};
 const {generateResponse}=await import('@lovable.dev/ai-gateway');
 const prompt=`أنت مؤرخ ومعلم خبير. اكتب ${missing} شريحة عرض تقديمي باللغة العربية الفصحى لطالب ضمن مشروع مدرسي.
موضوع المشروع: ${p.topic} — ${p.title_ar}
الفترة: ${p.historical_period||'غير محددة'} · النطاق الجغرافي: ${p.geographic_focus||'غير محدد'}
الموضوع الفرعي للطالب: ${s.subtopic_ar}
${existing?.length?`شرائح موجودة مسبقاً (لا تكررها، وأكمل التسلسل): ${existing.map((x:any)=>x.title_ar).join(' | ')}`:'ابدأ بشريحة تمهيدية واختم بشريحة خلاصة.'}
${p.instructions?`تعليمات المعلم: ${p.instructions}`:''}
القواعد: معلومات تاريخية دقيقة ومتفق عليها فقط، بلا اقتباسات أو أرقام مختلقة. العنوان قصير (أقل من 8 كلمات). النص 40–70 كلمة في 2–4 جمل واضحة لطلاب المدرسة. ملاحظات المتحدث 2–3 جمل. image_prompt_en: وصف إنجليزي دقيق لصورة تاريخية واقعية مناسبة لمحتوى الشريحة تحديداً (المكان، الحقبة، الملابس، العمارة)، بدون نصوص أو كتابة داخل الصورة. photo_query_en: 2–5 كلمات إنجليزية للبحث عن صورة حقيقية في ويكيميديا كومنز (اسم مكان أو أثر أو شخصية أو قطعة متحفية محددة، مثل: Great Sphinx of Giza).`;
 let parsed:{slides:{title_ar:string;body_ar:string;speaker_notes_ar:string;layout:string;image_prompt_en:string;photo_query_en:string}[]};
 try{const r=await generateResponse({model:'openai/gpt-6-astra',input:prompt,text:{format:{type:'json_schema',name:'slides',strict:true,schema:slideJson}}} as never);
  const out=(r as {output?:{type:string;content?:{type:string;text?:string}[]}[]}).output??[];const text=out.flatMap(o=>o.content??[]).filter(c=>c.type==='output_text').map(c=>c.text??'').join('');parsed=JSON.parse(text);}catch(e){friendly(e);}
 const start=(existing?.length??0);const rows=parsed.slides.slice(0,missing).map((x,i)=>({id:crypto.randomUUID(),presentation_id:deck.id,slide_order:start+i,title_ar:x.title_ar,body_ar:x.body_ar,speaker_notes_ar:x.speaker_notes_ar,layout:x.layout,image_subject:`${x.photo_query_en}\n${x.image_prompt_en}`,ai_generated:true,review_status:'draft',image_review:'pending'}));
 const {error:ie}=await sb.from('slides').insert(rows);if(ie)throw ie;await sb.from('audit_logs').insert({admin_id:context.userId,action:'ai_generate_slides',entity_id:s.id});return {created:rows.map(r=>r.id)};});
export const generateSlideImage=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((i:{slideId:string})=>z.object({slideId:z.string().uuid()}).parse(i)).handler(async({data,context})=>{await assertAdmin(context);const sb=context.supabase;
 const {data:sl,error}=await sb.from('slides').select('id,presentation_id,image_subject,title_ar').eq('id',data.slideId).single();if(error)throw error;
 const {data:deck}=await sb.from('presentations').select('student_id').eq('id',sl.presentation_id).single();if(!deck)throw new Error('Presentation not found');const {data:st}=await sb.from('students').select('project_id').eq('id',deck.student_id).single();if(!st)throw new Error('Student not found');
 const {generateImage}=await import('@lovable.dev/ai-gateway');let b64:string|undefined;
 try{const r=await generateImage({model:'openai/gpt-image-2.5-sunburst',prompt:`Historically accurate, photorealistic museum-quality illustration: ${sl.image_subject||sl.title_ar}. Cinematic natural lighting, 16:9 composition, no text, no letters, no captions, no watermarks.`,size:'1536x1024',quality:'medium',output_format:'jpeg'});b64=(r as {data?:{b64_json?:string}[]}).data?.[0]?.b64_json;}catch(e){friendly(e);}
 if(!b64)throw new Error('The AI did not return an image. Try again.');
 const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));const path=`${st.project_id}/ai-${crypto.randomUUID()}.jpg`;
 const {error:ue}=await sb.storage.from('project-media').upload(path,bytes,{contentType:'image/jpeg'});if(ue)throw ue;
 await sb.from('media_assets').insert({project_id:st.project_id,storage_path:path,ai_generated:true,license:'AI-generated illustration',attribution:'AI reconstruction (HistoryVerse Studio)'});
 const {error:se}=await sb.from('slides').update({image_path:path,image_license:'AI-generated illustration',image_attribution:'AI reconstruction (HistoryVerse Studio)',image_review:'pending'}).eq('id',sl.id);if(se)throw se;return {path};});

const strip=(h:string)=>h.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
export const findSlidePhoto=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((i:{slideId:string})=>z.object({slideId:z.string().uuid()}).parse(i)).handler(async({data,context})=>{await assertAdmin(context);const sb=context.supabase;
 const {data:sl,error}=await sb.from('slides').select('id,presentation_id,image_subject,title_ar').eq('id',data.slideId).single();if(error)throw error;
 const {data:deck}=await sb.from('presentations').select('student_id').eq('id',sl.presentation_id).single();if(!deck)throw new Error('Presentation not found');const {data:st}=await sb.from('students').select('project_id').eq('id',deck.student_id).single();if(!st)throw new Error('Student not found');
 const {data:proj}=await sb.from('projects').select('topic,title_en').eq('id',st.project_id).single();
 const {data:used}=await sb.from('media_assets').select('source_url').eq('project_id',st.project_id);const usedSet=new Set((used??[]).map((u:any)=>u.source_url));
 const first=(sl.image_subject||'').split('\n')[0]!.trim();const queries=[first,first.split(' ').slice(0,3).join(' '),proj?.title_en||''].filter(q=>q.length>2);
 const ok=/^(CC0|Public domain|PD|CC BY(-SA)? [0-9.]+)/i;
 for(const q of queries){const u=`https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=12&gsrsearch=${encodeURIComponent(q+' filetype:bitmap')}&prop=imageinfo&iiprop=url|extmetadata|mime|size&iiurlwidth=1600`;
  const r=await fetch(u,{headers:{'User-Agent':'HistoryVerseStudio/1.0 (school history projects)'}});if(!r.ok)continue;const j=await r.json() as {query?:{pages?:Record<string,{index:number;title:string;imageinfo?:{thumburl?:string;url:string;descriptionurl:string;mime:string;width:number;extmetadata?:Record<string,{value:string}>}[]}>}};
  const pages=Object.values(j.query?.pages??{}).sort((a,b)=>a.index-b.index);
  for(const pg of pages){const ii=pg.imageinfo?.[0];if(!ii||!/jpeg|png/.test(ii.mime)||ii.width<900||usedSet.has(ii.descriptionurl))continue;const m=ii.extmetadata??{};const lic=strip(m['LicenseShortName']?.value??'');if(!ok.test(lic))continue;
   const img=await fetch(ii.thumburl??ii.url,{headers:{'User-Agent':'HistoryVerseStudio/1.0'}});if(!img.ok)continue;const type=img.headers.get('content-type')??'image/jpeg';const buf=new Uint8Array(await img.arrayBuffer());if(buf.length>10*1024*1024)continue;
   const path=`${st.project_id}/photo-${crypto.randomUUID()}.${type.includes('png')?'png':'jpg'}`;const {error:ue}=await sb.storage.from('project-media').upload(path,buf,{contentType:type});if(ue)throw ue;
   const artist=strip(m['Artist']?.value??'Unknown author').slice(0,200);const attribution=`${artist} · Wikimedia Commons`;
   await sb.from('media_assets').insert({project_id:st.project_id,storage_path:path,source_url:ii.descriptionurl,attribution,license:lic,ai_generated:false});
   const {error:se}=await sb.from('slides').update({image_path:path,image_source_url:ii.descriptionurl,image_attribution:attribution,image_license:lic,image_review:'pending',ai_generated:false}).eq('id',sl.id);if(se)throw se;return {found:true,path};}}
 return {found:false};});
