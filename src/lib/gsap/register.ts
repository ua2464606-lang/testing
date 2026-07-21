/**
 * Central GSAP setup. Import `gsap` from here everywhere so plugins are only
 * registered once, and only in the browser.
 *
 * SplitText and MotionPathPlugin are bundled with GSAP 3.12+ (formerly the
 * "Club" plugins, now public) — no extra install required.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  gsap.defaults({ ease: "power3.out", duration: 1.1 });
  registered = true;
}

export { gsap, ScrollTrigger, MotionPathPlugin };
