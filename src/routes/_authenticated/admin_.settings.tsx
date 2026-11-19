import {createFileRoute} from '@tanstack/react-router';
import {Section} from '@/components/studio/sections';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/settings')({loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('Workspace settings','HistoryVerse Studio — workspace settings.'),component:()=> <Section kind="settings"/>});
