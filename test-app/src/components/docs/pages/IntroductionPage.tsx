const PRINCIPLES = [
  {
    label: "For All",
    desc: "You own the code, and it's free to use in your projects.",
  },
  {
    label: "Prop-First Approach",
    desc: "Easy customization through thoughtfully exposed props.",
  },
  {
    label: "Fully Modular",
    desc: "Install strictly what you need. Each background is independent.",
  },
  {
    label: "Free Choice",
    desc: "TypeScript or JS, plain CSS or Tailwind — the code is all here.",
  },
];

const STATS = [
  { value: "23", label: "Backgrounds" },
  { value: "0", label: "Dependencies" },
  { value: "Canvas 2D", label: "Renderer" },
  { value: "MIT", label: "License" },
];

export function IntroductionPage() {
  return (
    <div style={{ maxWidth: 680 }}>
      <h1
        className="docs-in font-display font-extrabold text-ink tracking-[-0.04em] leading-[1.05] mb-8"
        style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
      >
        Introduction
      </h1>

      <p className="docs-in-1 text-[15px] text-muted leading-[1.8] font-sans mb-5">
        alg-art-backgrounds is an open-source collection of algorithmic art
        React components that aim to enhance your web applications.
      </p>

      <p className="docs-in-1 text-[15px] text-muted leading-[1.8] font-sans mb-5">
        This is not your typical component library — you won't find a set of
        generic buttons, inputs, or other common UI elements here.
      </p>

      <p className="docs-in-1 text-[15px] text-muted leading-[1.8] font-sans mb-12">
        Basically, these components are here to help you stand out and make a
        statement visually by adding a touch of creativity to your projects.
      </p>

      <h2
        className="docs-in-2 font-display font-bold text-ink tracking-[-0.03em] mb-5"
        style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
      >
        Mission
      </h2>

      <p className="docs-in-2 text-[15px] text-muted leading-[1.8] font-sans mb-4">
        The goal of alg-art-backgrounds is simple — provide flexible, visually
        stunning, and most importantly, free components that take web projects
        to the next level.
      </p>

      <p className="docs-in-2 text-[14px] text-muted leading-[1.7] font-sans mb-5">
        To make that happen, the project is committed to the following
        principles:
      </p>

      <div className="docs-in-3 flex flex-col gap-3 mb-14">
        {PRINCIPLES.map((p) => (
          <div key={p.label} className="flex gap-2 items-start">
            <span
              className="font-bold font-sans shrink-0 mt-[2px]"
              style={{ color: "var(--color-accent)", fontSize: 15 }}
            >
              ·
            </span>
            <span className="text-[14px] text-muted font-sans leading-[1.7]">
              <span className="text-ink font-medium">{p.label}:</span>{" "}
              {p.desc}
            </span>
          </div>
        ))}
      </div>

      <div
        className="docs-in-4 grid gap-3"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-border rounded-xl px-4 py-3 flex flex-col gap-1"
          >
            <span className="font-display font-bold text-ink leading-none tracking-[-0.02em]" style={{ fontSize: 22 }}>
              {stat.value}
            </span>
            <span className="text-[12px] text-muted font-sans">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
