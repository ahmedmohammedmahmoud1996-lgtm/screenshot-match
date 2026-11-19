import {createFileRoute,notFound} from '@tanstack/react-router';
import {publicProject} from '@/lib/studio.functions';
import {metadata} from '@/lib/studio';
import {PublicSite} from '@/components/studio/public-site';
export const Route=createFileRoute('/projects/$slug')({loader:async({params})=>{const p=await publicProject({data:{slug:params.slug}});if(!p)throw notFound();return p},head:({loaderData})=>({...metadata(loaderData?.title_ar??'مشروع غير متاح',loaderData?.summary_ar??'مشروعات التاريخ التعليمية باللغة العربية.'),meta:[...metadata(loaderData?.title_ar??'مشروع غير متاح',loaderData?.summary_ar??'مشروعات التاريخ التعليمية باللغة العربية.').meta,...(loaderData?.visibility==='public'?[]:[{name:'robots',content:'noindex,nofollow'}])]}),component:()=> <PublicSite project={Route.useLoaderData()}/>});
