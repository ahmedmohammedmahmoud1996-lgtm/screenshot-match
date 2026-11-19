import {createFileRoute} from '@tanstack/react-router';
import {Editor} from '@/components/studio/editor';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/editor')({validateSearch:(s:Record<string,unknown>):{project?:string|undefined;student?:string|undefined}=>({project:typeof s['project']==='string'?s['project']:undefined,student:typeof s['student']==='string'?s['student']:undefined}),loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('Presentation editor','Edit independent Arabic student presentations and review each slide’s image.'),component:()=>{const s=Route.useSearch();return <Editor projectId={s['project']} studentId={s['student']}/>}});
