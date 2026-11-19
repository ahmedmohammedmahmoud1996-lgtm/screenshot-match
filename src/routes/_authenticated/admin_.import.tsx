import {createFileRoute} from '@tanstack/react-router';
import {Section} from '@/components/studio/sections';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/import')({loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('Bulk import','HistoryVerse Studio — bulk import.'),component:()=> <Section kind="import"/>});
