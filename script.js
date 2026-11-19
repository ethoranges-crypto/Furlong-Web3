/* ==========================================================
   Furlong Web3 — small site script (no libraries)
   ========================================================== */

/* ----------------------------------------------------------
   EDIT: BRAND NAME — change it here and every visible
   mention on the page updates (anything marked data-brand).
   For search engines and link previews, also replace the
   name in the <head> of index.html and privacy.html (see README).
   ---------------------------------------------------------- */
const SITE_CONFIG = {
  brandName: "Furlong Web3",
};

(function () {
  "use strict";

  /* ---------- Brand name ---------- */
  const DEFAULT_BRAND = "Furlong Web3";
  if (SITE_CONFIG.brandName && SITE_CONFIG.brandName !== DEFAULT_BRAND) {
    document.querySelectorAll("[data-brand]").forEach((el) => {
      el.textContent = SITE_CONFIG.brandName;
    });
    document.title = document.title.split(DEFAULT_BRAND).join(SITE_CONFIG.brandName);
  }
  // First letter of the brand for the logo square
  document.querySelectorAll(".logo-mark").forEach((el) => {
    el.textContent = SITE_CONFIG.brandName.trim().charAt(0).toUpperCase();
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Header: border once you scroll ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    // Close after choosing a link
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    // Close with Escape and return focus to the button
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    // Close when clicking outside the header
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("is-open") && !e.target.closest(".site-header")) setOpen(false);
    });
    // Reset if the window is resized to desktop
    window.matchMedia("(min-width: 900px)").addEventListener("change", () => setOpen(false));
  }

  /* ---------- Gentle fade-in on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Contact form (Formspree) ---------- */
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const submitBtn = form.querySelector('button[type="submit"]');
  const fields = Array.from(form.querySelectorAll("input[required], textarea[required]"));
  // While the action still contains YOUR-ID, nothing is sent: we just show the success message.
  const TEST_MODE = form.action.includes("YOUR-ID");

  const showStatus = (message, type) => {
    status.textContent = message;
    status.className = "form-status" + (type ? " is-" + type : "");
  };

  const validateField = (field) => {
    const error = document.getElementById(field.id + "-err");
    const value = field.value.trim();
    let ok = value.length > 0;
    if (ok && field.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    if (ok && field.minLength > 0) ok = value.length >= field.minLength;
    field.setAttribute("aria-invalid", String(!ok));
    if (error) error.hidden = ok;
    return ok;
  };

  // Re-check a field as soon as the visitor fixes it
  fields.forEach((field) => {
    field.addEventListener("input", () => { if (field.getAttribute("aria-invalid") === "true") validateField(field); });
    field.addEventListener("blur", () => { if (field.value) validateField(field); });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const invalid = fields.filter((f) => !validateField(f));
    if (invalid.length) {
      showStatus("Please check the highlighted fields.", "error");
      invalid[0].focus();
      return;
    }

    // Honeypot filled in = almost certainly a bot. Pretend it worked, send nothing.
    if (form.querySelector('[name="_gotcha"]').value) {
      form.reset();
      showStatus("Thanks, your message has been sent. We'll be in touch soon.", "success");
      return;
    }

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Sending…";
    showStatus("", "");

    try {
      if (TEST_MODE) {
        await new Promise((r) => setTimeout(r, 600));
        form.reset();
        showStatus("Thanks, your message has been sent. We'll be in touch soon. (Test mode: nothing was actually sent. Add your Formspree ID to go live.)", "success");
        return;
      }

      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.reset();
        fields.forEach((f) => f.removeAttribute("aria-invalid"));
        showStatus("Thanks, your message has been sent. We'll be in touch soon.", "success");
      } else {
        showStatus("Sorry, something went wrong and your message wasn't sent. Please try again, or book a call instead.", "error");
      }
    } catch (err) {
      showStatus("Sorry, we couldn't send your message. Please check your connection and try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
})();
