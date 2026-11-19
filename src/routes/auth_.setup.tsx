import {createFileRoute,useNavigate} from '@tanstack/react-router';
import {useEffect,useState,type FormEvent} from 'react';
import {supabase} from '@/integrations/supabase/client';
import {Button} from '@/components/ui/button';
import {inviteFirstAdmin} from '@/lib/setup.functions';
import {metadata} from '@/lib/studio';
function Setup(){const nav=useNavigate();const [signed,setSigned]=useState(false);const [email,setEmail]=useState('');const [pw,setPw]=useState('');const [msg,setMsg]=useState('');const [busy,setBusy]=useState(false);
useEffect(()=>{void supabase.auth.getSession().then(({data})=>setSigned(!!data.session));const {data}=supabase.auth.onAuthStateChange((_e,s)=>setSigned(!!s));return()=>data.subscription.unsubscribe()},[]);
async function invite(e:FormEvent){e.preventDefault();setBusy(true);setMsg('');try{await inviteFirstAdmin({data:{email,origin:window.location.origin}});setMsg('Invitation sent. Open the email link on this device to choose your password.')}catch(err){setMsg((err as Error).message)}setBusy(false)}
async function save(e:FormEvent){e.preventDefault();if(pw.length<8){setMsg('Use at least 8 characters.');return}setBusy(true);const {error}=await supabase.auth.updateUser({password:pw});if(error){setMsg(error.message);setBusy(false);return}await nav({to:'/admin'})}
return <div className="auth-form-wrap" style={{minHeight:'100vh'}}><div className="auth-form"><div className="eyebrow">FIRST ADMINISTRATOR</div>{signed?<><h2>Choose your password.</h2><form onSubmit={save}><label className="field">New password<input type="password" autoComplete="new-password" required value={pw} onChange={e=>setPw(e.target.value)}/></label>{msg&&<p className="error-text" role="alert">{msg}</p>}<Button size="lg" disabled={busy}>Save and open workspace</Button></form></>:<><h2>Set up the workspace owner.</h2><p>Only the authorized owner email can request the first administrator invitation.</p><form onSubmit={invite}><label className="field">Owner email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>{msg&&<p role="status">{msg}</p>}<Button size="lg" disabled={busy}>{busy?'Sending…':'Send invitation'}</Button></form></>}</div></div>}
export const Route=createFileRoute('/auth_/setup')({head:()=>metadata('First administrator setup','Invite the HistoryVerse Studio workspace owner.'),component:Setup});
