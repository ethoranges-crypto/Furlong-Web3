# Furlong Web3 website

A one-page static website for Furlong Web3 Ltd. It is plain HTML, CSS and a little JavaScript. There is no framework and no build step: you edit the files and upload them.

```
index.html      the page (all content lives here, marked with <!-- EDIT: ... --> comments)
privacy.html    short privacy note, linked from the footer and the form
styles.css      all styling; colours and sizes are at the top in :root
script.js       brand name setting, mobile menu, fade-in, contact form
robots.txt      lets search engines index the site
assets/         favicon, social share image (og-image.png), self-hosted Inter font
```

**Why it's built this way:** with no framework you can open any file and see exactly what's on the page. The font is stored with the site rather than loaded from Google, so visitors' details aren't sent to third parties and you don't need a cookie banner. The only outside services are Formspree (the form) and Calendly (bookings).

---

## 1. Preview it locally

**Quickest:** double-click `index.html` to open it in your browser.

**Recommended:** run a tiny local server. Browsers block self-hosted fonts on pages opened straight from disk, so without one you'll see a fallback font instead of Inter. In a terminal, from this folder, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Press `Ctrl+C` to stop the server.

---

## 2. Placeholder checklist

In VS Code (or any editor), use **Find in Files** (`Ctrl/Cmd+Shift+F`) to find each placeholder, then **Replace All**.

| ✔ | What | Find this text | Where |
|---|------|----------------|-------|
| ☐ | Calendly link | `https://calendly.com/YOUR-LINK` | index.html (header, hero, contact, optional embed) |
| ☐ | Formspree form ID | `YOUR-ID` | index.html (`<form action=...>`) |
| ☐ | Substack URL | `https://YOUR-SUBSTACK.substack.com` | index.html (Insights section, footer) |
| ☐ | LinkedIn URL | `https://www.linkedin.com/company/YOUR-COMPANY` | index.html (footer) |
| ☐ | Website domain | `https://YOUR-DOMAIN.com` | index.html `<head>` (canonical, og:url, og:image, twitter:image) |
| ☐ | Company number | `Company No. [PLACEHOLDER]` | index.html footer, privacy.html |
| ☐ | Registered office | `[PLACEHOLDER ADDRESS]` | index.html footer, privacy.html |
| ☐ | Stats | `[X]` | index.html, "Track record" section |
| ☐ | Testimonials | `[Placeholder quote` / `[Name]` | index.html, "Testimonials" section |
| ☐ | Founder bio | `[Founder Name]` | index.html, "About" section |
| ☐ | Logos (carousel + testimonials) | `assets/logos/logo-` | index.html; see "Adding logos" below |
| ☐ | Brand name | `Furlong Web3` | see section 5 |
| ☐ | Privacy note | `EDIT:` comments | privacy.html (date, retention period, analytics line) |
| ☐ | Analytics (optional) | `YOUR-CLOUDFLARE-TOKEN` | index.html `<head>` |

Final check: search the whole folder for `YOUR-`, `[X]` and `PLACEHOLDER`. Nothing should be left.

### Editing the text
Each block of copy has a comment above it, e.g. `<!-- EDIT: problem card 2 -->`. Change only the words between tags (`<p>like this</p>`) and leave the tags themselves alone.

### Fewer than 3 testimonials?
- **Remove one quote:** delete everything from its `<!-- EDIT: testimonial N -->` comment down to its closing `</figure>`. The layout adjusts by itself.
- **Hide the whole section:** change `<section class="section" id="testimonials"` to `<section hidden class="section" id="testimonials"`, and delete the `Testimonials` link in the header nav.

### Optional extras (already in the code, switched off)
- **Calendly calendar on the page:** in the Contact section, delete the two lines marked `START` and `END` around the embed. Note: Calendly sets cookies.
- **Analytics:** in `<head>`, pick Plausible *or* Cloudflare Web Analytics and delete the `START`/`END` lines around it. Both are cookie-free.

---

## Adding logos

Logos appear in two places, and all of them live in `assets/logos/`. The six files `logo-1.svg` to `logo-6.svg` are grey placeholders. Replace or delete them once your real logos are in.

**Only use a company's logo with its permission.**

### Logo carousel ("Trusted by teams across DeFi", below the hero)
In `index.html`, find `LOGO CAROUSEL`. The instructions are in a comment at the top of it.

- **Add a logo:** put the file in `assets/logos/` (e.g. `acme.svg`). Then copy one `<li>` line and change its `src`, `alt`, `width` and `height`. **Do this in both lists**: the main list and the duplicate list underneath. The duplicate is what makes the loop seamless, so the two lists must match.
- **Remove a logo:** delete its `<li>` line from **both** lists.
- **Change the speed:** in `styles.css`, change `--marquee-speed: 40s;`. A bigger number is slower. Add a few seconds for each logo you add so the speed stays roughly the same.
- **Change the heading:** edit the text inside `<h2 class="marquee-label">`.
- **Link a logo to the company's site (optional):** use the "Linked example" shown in the comment. In the duplicate list, also add `tabindex="-1"` to that `<a>` so keyboard users don't tab through each link twice.

Logos show in grey, slightly faded, and switch to full colour on hover. The carousel pauses on hover. For visitors who have "reduce motion" turned on, it doesn't scroll at all and shows a centred row instead.

### Testimonial logos
In each testimonial card there's a line marked `<!-- EDIT: testimonial N logo -->`. Change `src` and `alt` (e.g. `alt="Acme logo"`). If a testimonial has no logo, delete the `<img ...>` line and the card closes up neatly.

### `width` and `height`: what to put
These stop the page jumping while images load. They only need the right **proportions**, because the CSS sets the actual display size. For a logo about three times wider than tall, use `width="120" height="40"`. For a square one, use `width="40" height="40"`. In an SVG file, the `viewBox="0 0 W H"` at the top tells you the proportions.

### Tips for good-looking logos
- Use **SVG** where possible. It's sharp at any size and tiny. Otherwise use a **PNG with a transparent background**, at least 2× the display height (about 80px tall).
- **Trim the empty space** around the logo, or it will look smaller and off-centre next to the others. Figma, Illustrator or a free online "SVG crop" tool can do this.
- Prefer the horizontal (wide) version of a logo, and a single-colour version if the company has one.

---

## 3. Set up the contact form (Formspree, free)

Formspree receives form submissions and emails them to you, so your email address never appears on the site.

1. Sign up at <https://formspree.io> (the free plan allows 50 submissions/month).
2. Click **New Form**, name it "Website enquiries", and choose the inbox it should send to.
3. Copy the endpoint it gives you, which looks like `https://formspree.io/f/abcdwxyz`. The part after `/f/` is your ID.
4. In `index.html`, replace `YOUR-ID` in `action="https://formspree.io/f/YOUR-ID"` with your ID.
5. Publish the site (section 4) and send a test message from the **live** site. On its first submission Formspree asks you to confirm the form by email. Do that once.
6. Optional: in Formspree's settings, add your domain under **Restrict to domain** so other sites can't use your form.

**Test mode:** until you add your ID, submitting the form shows the success message with a "(Test mode: nothing was actually sent)" note. That lets you check the layout and validation safely.

**Spam protection:** the form has a hidden "honeypot" field (`_gotcha`). People can't see it, but spam bots fill it in, and Formspree silently drops those submissions.

---

## 4. Deploy for free

Both options below are free and give you HTTPS. Choose one.

### Option A: Cloudflare Pages
1. Create a free account at <https://dash.cloudflare.com>.
2. Go to **Workers & Pages → Create → Pages**.
3. Either:
   - **Upload assets** (simplest): name the project (e.g. `furlong-web3`) and drag in this whole folder, *or*
   - **Connect to Git**: choose this GitHub repository and branch. Leave the build command **empty** and set the output directory to `/`.
4. Click **Deploy**. Your site is live at `https://furlong-web3.pages.dev`.
5. To update it later: with Git, push your changes and it redeploys automatically. With uploads, open the project → **Create deployment** → upload again.

### Option B: Netlify
1. Create a free account at <https://app.netlify.com>.
2. **Add new site → Deploy manually**, then drag this folder onto the page. *Or* use **Import an existing project** → GitHub → pick this repo, with the build command empty and the publish directory `.`.
3. Your site is live at `https://something.netlify.app`. Rename it under **Site configuration → Change site name**.

### Connecting a custom domain later
1. Buy a domain from any registrar (Cloudflare Registrar sells at cost).
2. **Cloudflare Pages:** project → **Custom domains → Set up a domain** and follow the prompts. If the domain is on Cloudflare, DNS is configured for you.
   **Netlify:** **Domain management → Add a domain** and follow the DNS instructions (add the records it shows at your registrar).
3. HTTPS is issued automatically within a few minutes to a few hours.
4. Replace `https://YOUR-DOMAIN.com` in the `<head>` of `index.html` with your real domain so link previews work. Then paste your URL into <https://www.linkedin.com/post-inspector/> to check the preview image.

---

## 5. Change the brand name or accent colour

### Brand name
1. Open `script.js` and change `brandName: "Furlong Web3"` at the top. Every visible mention on the page (logo, About, footer) and the logo letter update automatically.
2. For search engines and link previews, also find and replace `Furlong Web3` in the `<head>` of `index.html` and `privacy.html`. These are read before JavaScript runs. Changing the visible fallback text in the HTML too is a good idea.
3. The legal entity line (`Furlong Web3 Ltd`, footer and privacy note) is your registered company name. Only change it if the company itself is renamed.
4. Recreate `assets/og-image.png` (1200×630) and the favicon if the letter changes. Canva or Figma both work: keep it simple, with the logo square, the name and the headline on an off-white background.

### Accent colour
Open `styles.css` and change these two lines at the top:

```css
--accent: #F26B1D;        /* main accent */
--accent-hover: #E05A0C;  /* a slightly darker shade for button hover */
```

The darker accent used for small text (`--accent-ink`) is calculated from `--accent` automatically, so it stays readable. Buttons use dark text on the accent. If you pick a dark accent, change `--on-accent` to `#FFFFFF`. Check contrast at <https://webaim.org/resources/contrastchecker/> (aim for 4.5:1 or higher). Also update the colour in `assets/favicon.svg`.

---

## Notes
- **No email address appears anywhere** in the code. Enquiries go through Formspree, and people with rights requests are pointed to the form.
- Accessibility: semantic HTML, a skip link, keyboard-accessible menu (Escape closes it), visible focus outlines, labelled form fields with error messages read out by screen readers, and fade-in animations that switch off for visitors with "reduce motion" turned on.
- The privacy note is a plain-English starting point, not legal advice.
- Font: Inter, licensed under the SIL Open Font License (`assets/fonts/Inter-LICENSE.txt`).
