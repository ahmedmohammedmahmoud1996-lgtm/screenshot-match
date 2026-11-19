import {createFileRoute} from '@tanstack/react-router';
import {Auth} from '@/components/studio/auth';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/auth')({head:()=>metadata('Administrator sign in','Secure invitation-only access to the HistoryVerse Studio workspace.'),component:Auth});
