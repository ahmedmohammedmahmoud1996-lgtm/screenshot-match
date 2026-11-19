import {createFileRoute} from '@tanstack/react-router';
import {Dashboard} from '@/components/studio/dashboard';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin')({loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('Dashboard','Your private HistoryVerse Studio project dashboard.'),component:Dashboard});
