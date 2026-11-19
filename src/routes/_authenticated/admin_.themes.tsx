import {createFileRoute} from '@tanstack/react-router';
import {Section} from '@/components/studio/sections';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/themes')({loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('Website theme studio','HistoryVerse Studio — website theme studio.'),component:()=> <Section kind="themes"/>});
