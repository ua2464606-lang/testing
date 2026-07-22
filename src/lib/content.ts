/**
 * All narrative copy for the film lives here so the acts stay pure layout.
 * Tone throughout: calm, confident, understated. No exclamation, no hype.
 */

export const BRAND = "FormulaeAI";

export const hero = {
  eyebrow: "FormulaeAI",
  // Rendered line by line, letter-settling in Act 0.
  lines: ["Your AI", "Marketing", "Employee."],
  sub: "A quiet intelligence that markets your business — every day, without being asked.",
  cue: "Scroll",
};

export const problem = {
  eyebrow: "The old way",
  // Each surfaces alone, like a subtitle, then dissolves.
  lines: [
    "First you hire a designer.",
    "Then an editor.",
    "Then someone to run the ads.",
    "You brief them. You wait. You approve.",
    "And next month, you begin again.",
  ],
  close: "It never really ends.",
};

export const discovery = {
  eyebrow: "Act I — The Discovery",
  title: "It notices your business.",
  body: "No forms. No onboarding. FormulaeAI reads what already exists — your site, your logo, your colours, the way your feed feels — and assembles a brand profile that sounds like you.",
  scanning: ["Website", "Logo", "Palette", "Voice", "Instagram"],
  card: {
    name: "Aurelia — Neighbourhood Kitchen",
    tags: ["Warm", "Seasonal", "Understated"],
    palette: ["#C6A15B", "#2E2A24", "#E7DFCF", "#8C5A3B"],
    voice: "Unhurried, generous, quietly proud of the craft.",
  },
};

export const creation = {
  eyebrow: "Act II — The Creation",
  title: "Then it makes the work.",
  body: "A post and a reel, composed in your brand — the image, the caption, the hashtags — built the way a studio would build them, in the time it takes to read this line.",
  caption:
    "Slow mornings deserve a good table. Today's plates are on us to imagine. ✦",
  hashtags: ["#neighbourhoodkitchen", "#seasonal", "#aurelia"],
  steps: ["Composing image", "Writing caption", "Adding tags", "Ready"],
};

export const gift = {
  eyebrow: "Act III — The Gift",
  from: "FormulaeAI",
  subject: "A little something we made for you",
  preview: "No pitch. Just proof — a post and a reel, already in your brand.",
  headline: "No pitch. Just proof.",
  body: "It lands in the owner's inbox as a finished sample. Not a demo. Not a trial. Something real, ready to post.",
};

export const partnership = {
  eyebrow: "Act IV — The Partnership",
  title: "After you say yes, it simply keeps going.",
  items: [
    { label: "Content calendar", note: "A month, planned and paced." },
    { label: "Reels", note: "Shot, cut, and scored to your brand." },
    { label: "Captions", note: "Written in your voice, every time." },
    { label: "Ad campaigns", note: "Launched, watched, and adjusted." },
    { label: "Optimisation", note: "Learning what your audience returns for." },
    { label: "Reports", note: "A calm summary. Only what matters." },
  ],
};

export const philosophy = {
  lead: "It should never feel like software.",
  body: "It should feel like hiring someone who never sleeps.",
};

export const audience = {
  eyebrow: "Act VI — Who it's for",
  title: "The places people love, told beautifully.",
  items: [
    { name: "Restaurants", note: "Every plate, a portrait." },
    { name: "Salons", note: "The craft, made visible." },
    { name: "Clinics", note: "Calm, trusted, present." },
    { name: "Gyms", note: "Momentum, on a schedule." },
    { name: "Cafés", note: "The regulars, and the ones to come." },
    { name: "Studios", note: "The work, always in frame." },
  ],
};

export const closing = {
  eyebrow: "FormulaeAI",
  lines: ["Let FormulaeAI", "work for", "your business."],
  cta: "Request your free sample",
  foot: "No pitch. Just proof.",
};
