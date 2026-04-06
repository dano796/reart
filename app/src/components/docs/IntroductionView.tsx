const PRINCIPLES = [
  {
    label: "Yours to Own",
    desc: "The CLI copies source files directly into your project — no runtime dependency, no black box. Read it, modify it, ship it.",
  },
  {
    label: "Prop-First Approach",
    desc: "Easy customization through thoughtfully exposed props.",
  },
  {
    label: "Fully Modular",
    desc: "Install strictly what you need. Each background is independent.",
  },
];

export function IntroductionView() {
  return (
    <div className="max-w-170">
      <h1 className="docs-in font-display font-extrabold text-ink leading-[1.05] mb-8 text-[clamp(32px,5vw,48px)]">
        Introduction
      </h1>

      <p className="docs-in-1 text-[15px] text-muted leading-[1.8] font-sans mb-5">
        ReArt is an open-source collection of animated canvas backgrounds
        inspired by algorithmic concepts. Each background is a self-contained
        renderer — installed via CLI, owned by you.
      </p>

      <p className="docs-in-1 text-[15px] text-muted leading-[1.8] font-sans mb-5">
        Inspired by shadcn/ui, instead of importing from a package, the CLI
        copies the component source files directly into your project. No runtime
        npm dependency — just code you can read, edit, and extend freely.
      </p>

      <p className="docs-in-1 text-[15px] text-muted leading-[1.8] font-sans mb-12">
        These components are here to help you stand out visually and make a
        statement — adding a touch of creativity to any web project.
      </p>

      <h2 className="docs-in-2 font-display font-bold text-ink mb-5 text-[clamp(22px,3vw,32px)]">
        Mission
      </h2>

      <p className="docs-in-2 text-[15px] text-muted leading-[1.8] font-sans mb-4">
        The goal of ReArt is simple — provide flexible, visually stunning
        backgrounds that you own entirely, taking your web projects to the next
        level.
      </p>

      <p className="docs-in-2 text-[14px] text-muted leading-[1.7] font-sans mb-5">
        To make that happen, the project is committed to the following
        principles:
      </p>

      <div className="docs-in-3 flex flex-col gap-3 mb-14">
        {PRINCIPLES.map((p) => (
          <div key={p.label} className="flex gap-2 items-start">
            <span className="font-bold font-sans shrink-0 mt-0.5 text-accent text-[15px]">
              ·
            </span>
            <span className="text-[14px] text-muted font-sans leading-[1.7]">
              <span className="text-ink font-medium">{p.label}:</span> {p.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
