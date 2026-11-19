# HistoryVerse Studio — Phase 1

## Goal
Build a working, privacy-first prototype for managing student history projects. Administration is entirely English; project websites and presentations are Arabic and RTL. Include administrator profiles, as confirmed.

## Phase 1 experience
1. **Secure administration:** invitation-only administrator accounts, login/logout, stored display names, separate secured roles, and a private `/admin` workspace. No public administrator registration. Provide a controlled first-administrator setup rather than automatically promoting new users.
2. **Dashboard and projects:** a polished museum-inspired SaaS workspace with clear navigation, real project statistics, search, status filters, and draft/project management. Use restrained charcoal, mint, and neutral surfaces, with relevant historical imagery. Support the requested light and dark appearances.
3. **Project creation:** a saved five-step wizard for historical details, students, presentation preferences, design, and review. Student records include independent 3–20 slide targets, subtopics, display names, privacy settings, and portrait uploads. Show group slide totals and an explicit apply-to-all action.
4. **Content and presentation editing:** manually create and edit Arabic slides, reorder them, approve them, and replace individual images. Changing a target does not delete existing slides or modify other students. Decreasing a deck requires confirmation and explicit slide selection. Distinguish requested counts from actual saved slides.
5. **Arabic websites:** dynamic `/projects/{slug}` and `/projects/{slug}/students/{student-slug}` pages, with three distinct design families: cinematic exhibition, editorial archive, and digital museum. Include student identity cards, sources, and a native 16:9 slideshow with fullscreen, keyboard, touch, progress, and return navigation.
6. **Privacy and publishing:** draft previews are administrator-only. Publish only reviewed content after checking slide counts, image review/licensing, and student privacy. Unlisted links use non-guessable identifiers and noindex. Uploaded portraits remain private and are delivered only according to publication/privacy rules.
7. **Samples:** three clearly labeled, unpublished illustrative projects for Ancient Egypt, the Industrial Revolution, and the Islamic Golden Age. Each has five fictional students and different individual slide counts. Use appropriately labeled reconstruction imagery when authentic licensed media is unavailable; do not fabricate citations or present samples as verified research.

## Data and architecture
- Enable Lovable Cloud for authentication, PostgreSQL data, private file storage, and server-side operations.
- Use the existing TanStack Start/React architecture, semantic Tailwind design tokens, reusable controls, and accessible reduced-motion-aware transitions.
- Separate administrator profiles from administrator roles. Authorization is checked on the server and enforced with row-level security.
- Normalize projects, students, presentations, slides, themes, media assets, source references, and audit logs. Prepare schema boundaries for later outlines and generation jobs without pretending those features are implemented.
- Derive actual slide counts from saved slides; store each student's target independently. Keep content, images, and theme configurations separate.
- Apply explicit database grants alongside policies. Seed all sample records in migrations, never on page load.
- Public readers receive only approved published projections, excluding original/private student details and drafts.
- Validate uploaded types and sizes; never expose private keys. Record relevant administrative mutations in audit logs.

## Verification
- Test independent slide counts, the initial 3–20 limits, safe count reduction, approved-slide preservation, and theme/content separation.
- Verify administrator authorization and draft access restrictions, including public reads of published projects only.
- Exercise the complete signed-in flow: create a project, add students with differing targets, save/edit slides, preview, review, publish, and read the resulting Arabic website.
- Check desktop/mobile layouts, Arabic typography, long titles, student-to-presentation links, fullscreen controls, and missing-image states.

## Deliberately deferred
Phase 2 introduces real AI outlines, precise Arabic generation, slide-specific image retrieval and licensing review, and regeneration. Phase 3 expands to eight layout families and twelve palettes. Phase 4 adds Excel/CSV bulk import, durable queued generation, QR codes, and privacy-conscious analytics. These are not presented as working during Phase 1; no fabricated generation progress, API integrations, or analytics.

## Delivery order
Cloud and security → design system and dashboard → saved project/student workflow → slide editor and private media → Arabic websites and publishing → sample data and end-to-end checks.