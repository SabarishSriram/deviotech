# Website: left to fix

Launch checklist, from a full review of the site on 2026-11-13. Do the **Before you market** items first — each one is either something a visitor would notice, something that could get you into trouble, or something that stops you taking money. Tick items off as they're done.

## Before you market

### Get it online
- [ ] **Hosting.** The site isn't deployed anywhere yet. The Cloudflare Workers test (Nov 2026) needed Workers Paid ($5/month), Next.js 16.4.5+, and `cacheComponents` switched off. Vercel works with no changes. Pick one and deploy.
- [ ] **Domain.** `deviotech.in` doesn't load, and every canonical URL, the sitemap and share previews point to it. Buy the Devvy domain, set `NEXT_PUBLIC_SITE_URL` on the host, and redeploy.
- [ ] **Email on the domain.** The contact address is `hello@deviotech.in` (in `data/site.ts`). Set up email on the new domain, and add SPF, DKIM and DMARC records so application and login emails don't land in spam.
- [ ] **Send yourself a test application** on the live site: check the "We got your application" email arrives, then send yourself the portal login from admin and log in.

### Be honest in what you claim
- [ ] **"250+ students enrolled"** shows on the home page and the Apply page (`hero.stats` and the apply page in `data/site.ts`). Use your real number, or replace it with something true (for example "9 tracks"). Misleading claims in ads can break advertising rules (ASCI) and consumer law.
- [ ] **A made-up certificate verifies as genuine.** `data/certificates.ts` has "Aarav Sharma, DEVVY-2026-0001", and the home page's certificate widget and the verify page's example use that ID. Remove it, or turn it into a clearly labelled sample.
- [ ] **"Senior developer mentors", "resume review", "code reviews"** — make sure you can deliver each promise on the home page for every student you take on.
- [ ] **"Course" or "internship".** The site is mixed: page titles, search descriptions, share images, structured data and `public/certificate-template.svg` say "course"; the FAQ, the program terms, the program name in `data/site.ts` and the certificate picture in `components/docs/screens/welcome.tsx` say "internship". Pick one and make every place match.

### Take payments and protect yourself
- [ ] **Payments.** There's no online payment: `lib/payment.ts` is a placeholder, and admin marks students Paid by hand. Decide: Razorpay (instructions are in `lib/payment.ts`) or a manual UPI link. Razorpay needs business KYC and the policy pages below before it activates your account.
- [ ] **Refund and cancellation policy.** There isn't one. Say exactly when someone can get the ₹499 back (for example, before week 1 starts) and how. Razorpay requires it.
- [ ] **Contact page with who you are.** Your business or legal name, an address, an email and a phone or WhatsApp number. Razorpay requires it, and it builds trust.
- [ ] **Fuller terms.** `/legal/terms` is four short paragraphs. Add payments, refunds (link the policy), what happens if you cancel a batch, certificates, governing law, and an effective date. The code itself says "review before going live" — have someone check it.
- [ ] **Fuller privacy policy.** Add who processes data for you (Supabase for the database, your email provider), how long you keep applications, how to delete your data, and a date.
- [ ] **Footer on every public page.** Privacy, Terms and Contact only appear on the home page (`app/(site)/page.tsx`). Someone arriving from an ad on a track page can't find them. Move `SiteFooter` into `app/(site)/layout.tsx`.

### Fix the broken bits
- [ ] **Social links.** `github.com/devvytech` is a 404 (the account doesn't exist), LinkedIn points to the old `/company/deviotech`, and Instagram couldn't be checked automatically — open it yourself. Create the accounts, or remove the links from `footer.socials` in `data/site.ts`.
- [ ] **Certificates can't actually be issued.** There's no certificates table, no way to issue one from admin, and the verify page reads a hard-coded list (`data/certificates.ts`). Needed before your first batch finishes: a table, an Issue certificate button in admin, a PDF from `public/certificate-template.svg`, and verify reading from the database.
- [ ] **Forgot password.** Students who lose their portal password are stuck. Add a "Forgot password?" link on `/portal/login` (Supabase has password-reset emails built in).

### Your own setup
- [ ] **Mentor email.** Put it in `mentorContact.email` in `data/site.ts`. Until then the docs say "your mentor's email address (it's in the welcome email we sent you)".
- [ ] **Run the progress migration.** Paste `supabase/migrations/003_doc_progress.sql` into Supabase → SQL Editor and run it. Until then, "Mark as done" ticks only save in the student's browser.
- [ ] **Change the admin password** — on your laptop and on the host. The current one is weak.

## Strongly recommended for launch

- [ ] **Analytics.** There's none, so you can't tell which ads or posts bring applications. Add privacy-friendly analytics (Vercel Analytics, Plausible or Umami — or GA4), and track two events: "Apply clicked" and "Application submitted". If you'll run Meta or Google ads, add their pixel too (with a cookie notice).
- [ ] **Spam protection on the apply form.** Nothing stops bots or repeat submissions (`app/api/apply/route.ts`). Add a hidden honeypot field, Cloudflare Turnstile, and refuse a second application from the same email within a day.
- [ ] **Who's behind it.** There's no About page and no mentor profiles. Students paying ₹499 want to know who'll review their code: names, photos, LinkedIn links, experience.
- [ ] **Social proof.** No testimonials or student projects yet. After your first batch, add 3–5 short testimonials and links to finished projects.
- [ ] **WhatsApp.** Students in India expect it. A "Chat on WhatsApp" link on the apply page and footer gets questions answered before they bounce.
- [ ] **Have a mentor build one project per track** from the new week plans before students start. Commands and library versions were written from current docs but not run end to end for every project. Plans are in `data/docs/build/<track>.ts`.

## SEO (after the domain is live)

- [ ] **Google Search Console.** Add the site, verify it with `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, and submit `/sitemap.xml`.
- [ ] **Bing Webmaster Tools.** Import from Search Console.
- [ ] **Content and links.** Guides that answer what students search for ("how to build a full-stack project for your resume", "best projects for CSE students"), a student-projects showcase, college placement pages, your LinkedIn page, and students sharing their certificates.

## Performance (later)

- [ ] **Home page is heavy.** About 2,100 DOM elements; the tracks section has about 220 inline SVGs. Lighthouse mobile performance is 87. Ideas: an SVG sprite for the tech logos, or fewer logos per card.
- [ ] **Unused JavaScript.** About 150 KB unused on first load (mostly framer-motion). Ideas: lazy-load sections below the fold, or CSS animations where it's only a fade.

## Done in the 2026-11-13 review

- [x] Home page crashed and re-rendered for visitors with "reduce motion" on (a hydration error) — fixed in every animated component.
- [x] "What you get" cards sat in uneven rows with gaps — fixed.
- [x] Phone header: the name wrapped and "Apply free" was cut off on small phones — fixed.
- [x] Plain, unbranded 404 page — now has the header, a way home and links to every track. Added a friendly error page too.
- [x] "40+ projects to build" — there are 27; the stat now says 27.
- [x] Home hero and FAQ checked in light and dark, on desktop and phone.
