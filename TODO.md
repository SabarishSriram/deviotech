# Website: left to fix

Things found during the SEO and docs work that still need doing. Tick them off as they're done.

## Needs you (not code)

- [ ] **Mentor email.** Put the address in `mentorContact.email` in `data/site.ts`. Until then the docs say "your mentor's email address (it's in the welcome email we sent you)" and the pictures show `your-mentor@example.com`.
- [ ] **Run the progress migration.** Paste `supabase/migrations/003_doc_progress.sql` into Supabase → SQL Editor and run it. Until then, "Mark as done" ticks are saved only in the student's browser, and admin shows "tracking isn't set up yet".
- [ ] **Change the admin password.** The current one is weak.

## SEO

- [ ] **Domain.** Canonical URLs, the sitemap and Open Graph links all use `https://deviotech.in` (the old name). When the Devvy domain is bought, set `NEXT_PUBLIC_SITE_URL` in the host's environment variables and redeploy. The contact email (`@deviotech.in`) in `data/site.ts` needs changing too.
- [ ] **LinkedIn link.** Still points to `/company/deviotech` in `data/site.ts`.
- [ ] **Google Search Console.** Add the site, verify it by putting the code in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, and submit `/sitemap.xml`.
- [ ] **Bing Webmaster Tools.** Same, with `NEXT_PUBLIC_BING_SITE_VERIFICATION`. (Or import from Search Console.)
- [ ] **Content and backlinks.** Technical SEO is done; ranking now depends on content and links. Ideas: a blog or guides answering what students search for ("virtual internship with certificate for CSE students", "how to build a full-stack project"); listing on college placement pages, LinkedIn, Internshala-style directories; asking past students to link their certificate pages.

## Performance

- [ ] **Home page is heavy.** About 2,100 DOM elements; the tracks section alone has about 220 inline SVGs (88 KB gzipped HTML). Lighthouse mobile performance is 87. Ideas: render the tech logos once as an SVG sprite (`<use href>`), or show fewer logos per track card.
- [ ] **Unused JavaScript.** About 150 KB is unused on first load (mostly framer-motion and widget code). Ideas: lazy-load below-the-fold sections, or swap framer-motion for CSS animations where it's only a fade.

## Not checked yet

- [ ] **Look at the home hero and the new FAQ section in a browser** (light and dark, phone and desktop). They passed the build and Lighthouse but haven't been eyeballed.
