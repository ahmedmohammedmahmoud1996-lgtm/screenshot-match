import {createFileRoute} from '@tanstack/react-router';
import {Section} from '@/components/studio/sections';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/publishing')({loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('Publishing center','HistoryVerse Studio — publishing center.'),component:()=> <Section kind="publishing"/>});
