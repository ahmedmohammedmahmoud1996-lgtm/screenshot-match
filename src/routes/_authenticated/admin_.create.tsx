import {createFileRoute} from '@tanstack/react-router';
import {Wizard} from '@/components/studio/wizard';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/create')({validateSearch:(s:Record<string,unknown>):{id?:string}=>({id:typeof s.id==='string'?s.id:undefined}),loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('Create project','Create a history project with individual student slide targets.'),component:()=>{const {id}=Route.useSearch();return <Wizard key={id??'new'} id={id}/>}});
