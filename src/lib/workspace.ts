import {queryOptions} from '@tanstack/react-query';
import {loadWorkspace} from './studio.functions';
export const workspaceOptions=()=>queryOptions({queryKey:['workspace'],queryFn:()=>loadWorkspace(),staleTime:10000});
