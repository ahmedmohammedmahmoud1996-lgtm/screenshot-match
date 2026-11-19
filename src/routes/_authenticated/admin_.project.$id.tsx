import {createFileRoute} from '@tanstack/react-router';
import {ProjectDetail} from '@/components/studio/project-detail';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/project/$id')({validateSearch:(s:Record<string,unknown>):{autogen?:boolean|undefined}=>({autogen:s['autogen']===true||s['autogen']==='1'||undefined}),loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('Project overview','Review students, presentations and publication readiness.'),component:()=>{const {id}=Route.useParams();const {autogen}=Route.useSearch();return <ProjectDetail id={id} autogen={Boolean(autogen)}/>}});
