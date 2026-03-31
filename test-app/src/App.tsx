import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/home/HeroSection";
import { GallerySection } from "./components/home/GallerySection";
import { StudioPage } from "./pages/StudioPage";
import { DocsPage } from "./pages/DocsPage";
import { useState, useEffect } from "react";
import { ROUTES } from "./lib/constants";
import { matchRoute } from "./lib/routing";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const studioMatch = matchRoute(ROUTES.studioBackground, currentPath);
  const docsMatch = matchRoute(ROUTES.docsBackground, currentPath);

  if (
    currentPath === ROUTES.studio ||
    currentPath === "/Studio" ||
    studioMatch
  ) {
    return <StudioPage key="studio" backgroundId={studioMatch?.id} />;
  }

  if (currentPath === ROUTES.docs || docsMatch) {
    return <DocsPage key="docs" backgroundId={docsMatch?.id} />;
  }

  return (
    <div className="bg-bg min-h-svh">
      <Navbar />
      <HeroSection />
      <GallerySection />
      <Footer />
    </div>
  );
}
