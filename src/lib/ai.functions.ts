import {createServerFn} from '@tanstack/react-start';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {z} from 'zod';
async function assertAdmin(context:{supabase:any;userId:string}){const {data}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});if(!data)throw new Error('Forbidden');}
function friendly(e:unknown):never{const name=(e as {name?:string})?.name??'';console.error('AI generation failed',e);if(name==='PaymentRequiredError')throw new Error('AI credits are exhausted. Add credits to continue generating.');if(name==='RateLimitError')throw new Error('The AI service is busy. Wait a minute and try again.');throw new Error(e instanceof Error&&e.message?`AI generation failed: ${e.message}`:'AI generation failed.');}
const slideJson={type:'object',additionalProperties:false,required:['slides'],properties:{slides:{type:'array',items:{type:'object',additionalProperties:false,required:['title_ar','body_ar','speaker_notes_ar','layout','image_prompt_en'],properties:{title_ar:{type:'string'},body_ar:{type:'string'},speaker_notes_ar:{type:'string'},layout:{type:'string',enum:['split','statement','spotlight','image']},image_prompt_en:{type:'string'}}}}}};
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
القواعد: معلومات تاريخية دقيقة ومتفق عليها فقط، بلا اقتباسات أو أرقام مختلقة. العنوان قصير (أقل من 8 كلمات). النص 40–70 كلمة في 2–4 جمل واضحة لطلاب المدرسة. ملاحظات المتحدث 2–3 جمل. image_prompt_en: وصف إنجليزي دقيق لصورة تاريخية واقعية مناسبة لمحتوى الشريحة تحديداً (المكان، الحقبة، الملابس، العمارة)، بدون نصوص أو كتابة داخل الصورة.`;
 let parsed:{slides:{title_ar:string;body_ar:string;speaker_notes_ar:string;layout:string;image_prompt_en:string}[]};
 try{const r=await generateResponse({model:'openai/gpt-6-astra',input:prompt,text:{format:{type:'json_schema',name:'slides',strict:true,schema:slideJson}}} as never);
  const out=(r as {output?:{type:string;content?:{type:string;text?:string}[]}[]}).output??[];const text=out.flatMap(o=>o.content??[]).filter(c=>c.type==='output_text').map(c=>c.text??'').join('');parsed=JSON.parse(text);}catch(e){friendly(e);}
 const start=(existing?.length??0);const rows=parsed.slides.slice(0,missing).map((x,i)=>({id:crypto.randomUUID(),presentation_id:deck.id,slide_order:start+i,title_ar:x.title_ar,body_ar:x.body_ar,speaker_notes_ar:x.speaker_notes_ar,layout:x.layout,image_subject:x.image_prompt_en,ai_generated:true,review_status:'draft',image_review:'pending'}));
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
