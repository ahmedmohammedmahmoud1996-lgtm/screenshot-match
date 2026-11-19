import {createFileRoute} from '@tanstack/react-router';
import {Dashboard} from '@/components/studio/dashboard';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/projects')({loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('All projects','Manage your HistoryVerse Studio project collection.'),component:()=> <Dashboard all/>});
