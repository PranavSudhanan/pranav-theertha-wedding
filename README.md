# Pranav & Theertha — wedding website

A single-page wedding site covering both days — the party on Saturday
14 November at Hilltop Auditorium, and the muhurtham on Sunday 15 November at
Reef Club Resort. Editorial hero, the invitation, a live countdown, your story,
the order of both days, a gallery with a lightbox, both venues, an RSVP form
that actually collects responses, and an FAQ.

Built with **Next.js 16** (App Router, React 19) and hand-written CSS — no UI
framework, no animation library. It deploys to Vercel as-is.

---

## 1. Change anything on the site

Almost everything lives in one file: **[`lib/config.ts`](lib/config.ts)**.

Edit a value, save, and the page updates. No HTML to hunt through.

| What you want to change | Where |
| --- | --- |
| Names, parents' names | `couple` |
| **Date, muhurtham time, countdown** | `wedding` |
| Ceremony venue, Google Maps link | `venue` |
| **The wedding party (14 Nov) and its venue** | `party` |
| Order of the wedding day | `schedule` |
| Your story (4 chapters) | `story` |
| Which photos appear, and their order | `gallery` |
| **Your phone / WhatsApp number** | `contact` |
| Travel tiles | `travel` |
| FAQ questions | `faqs` |
| Nav menu items | `nav` |

### ⚠️ Read these before you share the link

Lines marked `// ✎ PLACEHOLDER` in `lib/config.ts` are **my sensible guesses,
not your facts.** Please go through them:

1. **`party.icsEnd`** — the party starts at 4:00 PM, which you confirmed. The
   calendar entry currently ends at 9:00 PM because a calendar entry needs an
   end; move `party.icsEnd` if the evening runs longer or shorter. (IST is
   UTC+5:30, so 4:00 PM is `T103000Z` and 9:00 PM is `T153000Z`.)
2. **`party.blurb`** — my words about the evening, not yours. Rewrite it.
3. **`story`** — six chapters, written from what you told me: the July 2022
   course, friends first, 2023, the March and May family visits, the wedding.
   Read it over and make the wording yours. I deliberately left out *which*
   course it was — say the word and I'll put it back in.
4. **`contact`** — empty by default. Add your WhatsApp number in international
   format (digits only, e.g. `919876543210`) and the FAQ contact line and the
   post-RSVP WhatsApp button switch themselves on.
5. **`schedule`** — the 9:00 AM welcome and 11:30 AM sadhya are assumptions.
   Only the 10:00–10:30 muhurtham came from your card.
6. **`faqs`** — the dress code and the 15 October RSVP deadline are assumptions.

> **A note on the printed card.** It reads "Saturday, 15 November 2026", but
> 15 November 2026 is a **Sunday**. The party date on the card (Saturday,
> 14 November) is correct. The site says Sunday for the wedding day. If you are
> reprinting anything, that is the line to fix.

### If you ever change the date

`wedding.date` drives the countdown, the `.ics` file and the search-engine
data. Change it and also update `dateLong`, `dateWords`, `year`, `dateShort`,
`icsStart` and `icsEnd` just below it — they are plain text so you control the
wording.

### Changing photos

Two small steps, because every photo carries a baked-in blurred preview so it
fades up instead of popping in out of a grey box:

1. Drop the file into `public/images/`.
2. Add an import and a line to the map in **`lib/images.ts`**.

Then reference the same `"/images/…"` path from `lib/config.ts`. If you forget
step 2 the site tells you exactly which path is missing.

Portrait photos around 3:4 suit the layout best. Next.js resizes them and
serves AVIF/WebP automatically — no need to compress anything first.

---

## 2. Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

---

## 3. Deploy to Vercel

### Option A — straight from this folder (fastest)

```bash
npx vercel
```

Log in when prompted, accept the defaults (Vercel detects Next.js on its own),
and you get a live URL. When you are happy with it:

```bash
npx vercel --prod
```

### Option B — via GitHub (best if you want to keep editing)

This repo already points at
`github.com/PranavSudhanan/pranav-theertha-wedding`, so it is just:

```bash
git add -A
git commit -m "Wedding site"
git push
```

Then go to [vercel.com/new](https://vercel.com/new), import the repository and
click Deploy. Every `git push` after that redeploys automatically.

### After it is live

Set `NEXT_PUBLIC_SITE_URL` in **Vercel → Settings → Environment Variables** to
your real URL (e.g. `https://pranav-theertha.vercel.app`). That is what makes
the preview card look right when you share the link on WhatsApp.

---

## 4. Where the RSVPs go

**Straight to your inbox at ls.pranav.36@gmail.com.**

Each response arrives as a formatted email — name, phone, which days they are
coming to, how many, whose side, and their message — with the guest's own email
set as the reply-to, so hitting Reply writes back to them directly.

### Switching it on (about three minutes)

1. Sign up at [resend.com](https://resend.com) **using ls.pranav.36@gmail.com**.
   The free tier allows 100 emails a day.
2. Go to **API Keys → Create API Key**, and copy it (it starts `re_`).
3. In Vercel: **your project → Settings → Environment Variables**, add

   | Name | Value |
   | --- | --- |
   | `RESEND_API_KEY` | the key you just copied |

   and redeploy.

That is the whole setup. `RSVP_TO_EMAIL` already defaults to your address, and
the sender defaults to Resend's shared `onboarding@resend.dev`.

> **Why you must sign up with that exact address.** Until you verify a domain
> of your own, Resend only delivers to the address the account was created
> with. Sign up with ls.pranav.36@gmail.com and it works immediately. If you
> later own a domain, verify it in Resend and set `RSVP_FROM_EMAIL` to
> something like `Wedding <rsvp@yourdomain.com>`, and the limit disappears.

### Until the key is set

Responses are written to your Vercel runtime logs (**your project → Logs**) and
guests still see a thank-you. Nothing breaks — but nothing reaches your inbox
either, so do step 3 before you share the link.

### If a response ever fails to send

The guest is told plainly, the form keeps everything they typed, and the button
becomes "Try again". It never claims success it did not have.

### Also keeping a spreadsheet (optional)

Set `RSVP_WEBHOOK_URL` and every RSVP is additionally POSTed there as JSON.
A Google Sheet takes about five minutes:

1. Create a sheet with these headers in row 1:
   `submittedAt`, `name`, `phone`, `email`, `attending`, `days`, `guests`,
   `side`, `message`
2. **Extensions → Apps Script**, and replace the contents with:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     const d = JSON.parse(e.postData.contents);
     sheet.appendRow([
       d.submittedAt, d.name, d.phone, d.email,
       d.attending, d.days, d.guests, d.side, d.message,
     ]);
     return ContentService.createTextOutput("ok");
   }
   ```

3. **Deploy → New deployment → Web app**. *Execute as* **Me**, *Who has access*
   **Anyone**. Copy the web-app URL into `RSVP_WEBHOOK_URL` in Vercel.

Email and the sheet run independently — if one fails the other still gets
through, and the guest only sees an error if both do.

### Keeping the noise out

The form carries a hidden field no human ever sees; anything that fills it is
accepted and silently dropped. Beyond that, one address can send at most six
responses a minute.

## 5. What's in here

```
app/
  layout.tsx           fonts, SEO metadata, schema.org data for both events
  page.tsx             section order
  globals.css          the entire design system
  opengraph-image.tsx  the 1200×630 card people see when they share the link
  apple-icon.tsx       the icon if someone adds it to their home screen
  icon.svg             favicon
  not-found.tsx        a 404 page that still looks like the invitation
  sitemap.ts, robots.ts
  api/rsvp/route.ts    RSVP endpoint
components/            one file per section, plus small shared pieces
lib/config.ts          ← everything you'll want to edit
lib/images.ts          the photo registry (see "Changing photos")
public/images/         your photographs
```

### The share card

When the link is pasted into WhatsApp, the preview is generated by
`app/opengraph-image.tsx` — a proper 1200×630 card with your names, the date
and both venues, in the site's own typefaces. It is built fresh from
`lib/config.ts`, so if you change the date the card changes with it. Nothing to
export by hand.

**Design notes.** Colours are lifted from your printed card — ivory paper,
antique gold, deep Kerala green, with the wine you both wore in
March as the accent. Type is Cormorant Garamond (display), Pinyon Script (the names, echoing
the card), Jost (interface) and Tiro Devanagari Sanskrit (the om and the
shloka). Scroll reveals, parallax and the opening curtain run on ~1 kB of
hand-written JavaScript, and all of it stands down for visitors who have
"reduce motion" switched on.

**The motifs** in `components/Ornaments.tsx` are hand-drawn SVG line work, so
they scale and take the gold colour from CSS: Ganapati at the head of the
invitation, a kalasham for the party, a nilavilakku for the muhurtham, a kolam
rosette behind the blessing, and mango paisleys and lotuses in the rules.
