import { Grain, Letterbox } from "@/components/shared/Atmosphere";
import { ProgressLine } from "@/components/shared/ProgressLine";
import { Act0Hero } from "@/components/acts/Act0Hero";
import { Act1Problem } from "@/components/acts/Act1Problem";
import { Act2Discovery } from "@/components/acts/Act2Discovery";
import { Act3Creation } from "@/components/acts/Act3Creation";
import { Act4Gift } from "@/components/acts/Act4Gift";
import { Act5Partnership } from "@/components/acts/Act5Partnership";
import { Act6Philosophy } from "@/components/acts/Act6Philosophy";
import { Act7Audience } from "@/components/acts/Act7Audience";
import { Act8Closing } from "@/components/acts/Act8Closing";

/**
 * The whole film, in order. Each act is its own module; the page just sequences
 * them into one continuous scroll. Atmosphere (grain, letterbox, progress line)
 * lives above everything.
 */
export default function Home() {
  return (
    <>
      <Grain />
      <Letterbox />
      <ProgressLine />
      <main className="film">
        <Act0Hero />
        <Act1Problem />
        <Act2Discovery />
        <Act3Creation />
        <Act4Gift />
        <Act5Partnership />
        <Act6Philosophy />
        <Act7Audience />
        <Act8Closing />
      </main>
    </>
  );
}
