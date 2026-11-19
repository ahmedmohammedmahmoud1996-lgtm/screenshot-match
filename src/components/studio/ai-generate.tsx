import {useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {Sparkles} from 'lucide-react';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {generateStudentSlides,generateSlideImage} from '@/lib/ai.functions';
import type {Student} from '@/lib/studio';
export function AIGenerateButton({students,label='Generate with AI',size='sm'}:{students:Student[];label?:string;size?:'sm'|'default'}){const qc=useQueryClient();const [progress,setProgress]=useState<string|null>(null);
async function run(){const todo=students.filter(s=>s.slides.length<s.requested_slide_count||s.slides.some(x=>!x.image_path));if(!todo.length){toast.info('All slides already exist. Add to a student’s target to generate more.');return}
 try{for(const [i,s] of todo.entries()){setProgress(`${s.name_original}: writing slides (${i+1}/${todo.length})`);const {created}=await generateStudentSlides({data:{studentId:s.id}});const needImages=[...created,...s.slides.filter(x=>!x.image_path).map(x=>x.id)];for(const [j,id] of needImages.entries()){setProgress(`${s.name_original}: image ${j+1}/${needImages.length}`);await generateSlideImage({data:{slideId:id}});}await qc.invalidateQueries({queryKey:['workspace']});}
 toast.success('Slides and images generated. Review and approve them before publishing.')}catch(e){toast.error(e instanceof Error?e.message:String(e))}finally{setProgress(null);await qc.invalidateQueries({queryKey:['workspace']})}}
return <div className="flex items-center gap-2"><Button size={size} disabled={Boolean(progress)} onClick={run}><Sparkles/>{progress?'Generating…':label}</Button>{progress&&<span className="text-xs text-muted-foreground" aria-live="polite">{progress}</span>}</div>}
