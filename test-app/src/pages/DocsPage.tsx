import { Navbar } from "../components/Navbar";
import { DocsSection } from "../components/DocsSection";

export function DocsPage() {
  return (
    <div className="bg-bg min-h-svh">
      <Navbar />
      <div style={{ paddingTop: 58 }}>
        <DocsSection />
      </div>
    </div>
  );
}
