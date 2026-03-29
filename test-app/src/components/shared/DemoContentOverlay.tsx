export function DemoContentOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col">
      {/* Fake navbar */}
      <div className="h-12 flex items-center justify-between px-5 shrink-0 bg-[rgba(12,12,20,0.35)] backdrop-blur-sm border-b border-white/6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center text-white font-bold font-display shrink-0 bg-accent text-[10px]">
            A
          </div>
          <span className="text-[12px] font-display font-semibold text-ink">
            YourBrand
          </span>
        </div>
        <div className="flex items-center gap-5">
          {["Home", "About", "Docs"].map((link) => (
            <span
              key={link}
              className="text-[12px] font-sans cursor-default text-[rgba(232,230,220,0.65)]"
            >
              {link}
            </span>
          ))}
        </div>
      </div>

      {/* Centered hero content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <div className="font-mono mb-1 text-[10px] tracking-[0.14em] text-accent uppercase">
          ✦ New Background
        </div>
        <h2 className="font-display font-bold text-ink text-center text-[clamp(20px,3.5vw,30px)] leading-[1.15] [text-shadow:0_2px_24px_rgba(0,0,0,0.8)] max-w-90">
          The web, made fluid
          <br />
          at your fingertips.
        </h2>
        <div className="flex items-center gap-3">
          <button className="py-2.25 px-5.5 text-[13px] rounded-lg text-white font-semibold font-display cursor-default border-0 bg-accent">
            Get Started
          </button>
          <button className="py-2.25 px-5.5 text-[13px] rounded-lg font-semibold font-display cursor-default text-[rgba(232,230,220,0.85)] bg-white/8 border border-white/[0.14]">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
