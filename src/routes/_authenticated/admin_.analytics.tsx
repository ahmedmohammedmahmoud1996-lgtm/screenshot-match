import {createFileRoute} from '@tanstack/react-router';
import {Section} from '@/components/studio/sections';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/analytics')({loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('Project analytics','HistoryVerse Studio — project analytics.'),component:()=> <Section kind="analytics"/>});
