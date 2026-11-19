import {createFileRoute} from '@tanstack/react-router';
import {Auth} from '@/components/studio/auth';
import {metadata} from '@/lib/studio';
export const Route=createFileRoute('/')({head:()=>metadata('History project workspace','HistoryVerse Studio brings student history projects and Arabic presentations together.'),component:Auth});
