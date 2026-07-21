import { ExperienceRoot } from "@/components/ui/ExperienceRoot";

/**
 * The entire site is one route: a single continuous cinematic shot.
 * All scenes live inside <ExperienceRoot />, driven by scroll.
 */
export default function Page() {
  return (
    <main>
      <ExperienceRoot />
    </main>
  );
}
