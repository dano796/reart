import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { GallerySection } from "./components/GallerySection";
import { Footer } from "./components/Footer";
import { StudioPage } from "./pages/StudioPage";
import { DocsPage } from "./pages/DocsPage";
import { useState, useEffect } from "react";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (currentPath === "/Studio") {
    return <StudioPage />;
  }

  if (currentPath === "/docs") {
    return <DocsPage />;
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
