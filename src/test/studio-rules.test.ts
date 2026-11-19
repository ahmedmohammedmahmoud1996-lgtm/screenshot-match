import {describe,it,expect} from 'vitest';
import {changeStudentTarget,validateSlideCount,publicationErrors,type Student,type Project} from '@/lib/studio';
const students=[{id:'ahmed',name_original:'Ahmed',requested_slide_count:5,slides:[{id:'approved',review_status:'approved',title_ar:'عنوان',body_ar:'نص',image_license:''}]},{id:'sara',name_original:'Sara',requested_slide_count:8,slides:[]}] as unknown as Student[];
describe('Independent presentation rules',()=>{
it('accepts configured slide counts of 3 through 20 only',()=>{expect(validateSlideCount(3)).toBe(3);expect(validateSlideCount(20)).toBe(20);expect(()=>validateSlideCount(2)).toThrow();expect(()=>validateSlideCount(21)).toThrow();expect(()=>validateSlideCount(5.5)).toThrow()});
it('changing Ahmed to 12 slides leaves Sara at 8',()=>{const next=changeStudentTarget(students,'ahmed',12);expect(next[0]?.requested_slide_count).toBe(12);expect(next[1]?.requested_slide_count).toBe(8)});
it('increasing targets preserves approved slides',()=>{const next=changeStudentTarget(students,'ahmed',12);expect(next[0]?.slides).toEqual([{id:'approved',review_status:'approved',title_ar:'عنوان',body_ar:'نص',image_license:''}])});
it('decreasing targets does not silently delete approved slides',()=>{const next=changeStudentTarget(students,'ahmed',3);expect(next[0]?.slides).toHaveLength(1);expect(next[0]?.slides[0]?.review_status).toBe('approved')});
it('publication rejects decks differing from their individual targets',()=>{const p={summary_ar:'مقدمة',students} as Project;expect(publicationErrors(p)).toContain('Ahmed: 1 of 5 slides.');expect(publicationErrors(p)).toContain('Sara: 0 of 8 slides.')});
it('publication requires image review and licensing',()=>{const slides=Array.from({length:3},(_,i)=>({id:String(i),title_ar:'عنوان',body_ar:'نص',review_status:'approved',image_path:'photo',image_review:'pending',image_license:''}));const p={summary_ar:'مقدمة',students:[{name_original:'Ahmed',requested_slide_count:3,slides}]} as unknown as Project;expect(publicationErrors(p)).toContain('Ahmed: images and licenses need review.')});
});
