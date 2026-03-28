import { BackgroundStudio } from "alg-art-backgrounds";

export function StudioPage() {
  const initialBg = sessionStorage.getItem("studio-initial-bg") ?? undefined;

  return (
    <div className="w-screen h-screen overflow-hidden">
      <BackgroundStudio initialBg={initialBg} />
    </div>
  );
}
