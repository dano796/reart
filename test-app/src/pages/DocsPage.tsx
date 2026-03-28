import { Navbar } from "../components/layout/Navbar";
import { DocsSection } from "../components/docs/DocsSection";

export function DocsPage() {
  return (
    <div className="bg-bg min-h-svh">
      <Navbar />
      <div className="pt-14.5">
        <DocsSection />
      </div>
    </div>
  );
}
