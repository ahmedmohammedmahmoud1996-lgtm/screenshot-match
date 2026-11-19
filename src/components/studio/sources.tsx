import {useState} from 'react';
import {useQuery,useQueryClient} from '@tanstack/react-query';
import {BookOpen,Trash2,Plus,CheckCircle2} from 'lucide-react';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {listSources,saveSource,removeSource} from '@/lib/studio.functions';
export function SourcesPanel({projectId}:{projectId:string}){const qc=useQueryClient();const key=['sources',projectId];const {data:rows=[]}=useQuery({queryKey:key,queryFn:()=>listSources({data:{projectId}})});const [title,setTitle]=useState('');const [url,setUrl]=useState('');
async function run(fn:()=>Promise<unknown>,msg:string){try{await fn();await qc.invalidateQueries({queryKey:key});toast.success(msg)}catch(e){toast.error(e instanceof Error?e.message:String(e))}}
return <section className="form-section mt-6"><div className="section-heading"><div><h2>Sources</h2><p>Add only sources you have checked. Mark each as verified once reviewed.</p></div><BookOpen size={18}/></div>
{rows.map(r=><div className="settings-line" key={r.id}><div><strong>{r.title}</strong><p className="text-xs break-all"><a href={r.url} target="_blank" rel="noreferrer">{r.url}</a></p></div><div className="flex gap-2"><Button size="sm" variant={r.verified?'default':'outline'} onClick={()=>run(()=>saveSource({data:{id:r.id,projectId,title:r.title,url:r.url,verified:!r.verified}}),r.verified?'Marked unverified':'Marked verified')}><CheckCircle2/>{r.verified?'Verified':'Mark verified'}</Button><Button size="sm" variant="ghost" aria-label={`Remove ${r.title}`} onClick={()=>{if(window.confirm('Remove this source?'))run(()=>removeSource({data:{id:r.id}}),'Source removed')}}><Trash2/></Button></div></div>)}
{!rows.length&&<p className="text-sm text-muted-foreground">No sources yet.</p>}
<form className="flex flex-wrap gap-2 mt-4" onSubmit={e=>{e.preventDefault();run(async()=>{await saveSource({data:{projectId,title,url,verified:false}});setTitle('');setUrl('')},'Source added')}}><input aria-label="Source title" placeholder="Source title" className="flex-1 min-w-48" value={title} onChange={e=>setTitle(e.target.value)} required/><input aria-label="Source URL" type="url" placeholder="https://" className="flex-1 min-w-48" value={url} onChange={e=>setUrl(e.target.value)} required/><Button type="submit" variant="outline"><Plus/>Add source</Button></form></section>}
