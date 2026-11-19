import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
const OWNER='drahmedms@icloud.com';
export const inviteFirstAdmin=createServerFn({method:'POST'}).inputValidator((i:{email:string;origin:string})=>z.object({email:z.string().email(),origin:z.string().url()}).parse(i)).handler(async({data})=>{
 if(data.email.trim().toLowerCase()!==OWNER)throw new Error('This email is not authorized for first-administrator setup.');
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {count}=await supabaseAdmin.from('user_roles').select('id',{count:'exact',head:true}).eq('role','admin');
 if(count)throw new Error('An administrator already exists. Ask them for an invitation.');
 const {error}=await supabaseAdmin.auth.admin.inviteUserByEmail(OWNER,{redirectTo:`${new URL(data.origin).origin}/auth/setup`});
 if(error)throw new Error(error.message);return true;});
