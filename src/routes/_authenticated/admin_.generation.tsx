import {createFileRoute} from '@tanstack/react-router';
import {Section} from '@/components/studio/sections';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/generation')({loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('AI generation center','HistoryVerse Studio — ai generation center.'),component:()=> <Section kind="generation"/>});
