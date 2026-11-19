import {createFileRoute} from '@tanstack/react-router';
import {Section} from '@/components/studio/sections';
import {workspaceOptions} from '@/lib/workspace';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/_authenticated/admin_/students')({loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions()),head:()=>metadata('Groups and students','HistoryVerse Studio — groups and students.'),component:()=> <Section kind="students"/>});
