import {createFileRoute} from '@tanstack/react-router';
import {Section} from '@/components/studio/sections';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/media')({loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('Private media library','HistoryVerse Studio — private media library.'),component:()=> <Section kind="media"/>});
