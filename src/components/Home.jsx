import { Navbar } from "./Navbar";
import { ThemeToggle } from "./ThemeToggle";
import { StarBackground } from "@/components/StarBackground";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";

import { ProjectsSection } from "./ProjectsSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";
import LandingPage from "./Landing";

export const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Theme Toggle */}
      <ThemeToggle />
      {/* Background Effects */}
      <StarBackground />

      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <main>
        <HeroSection />
        < LandingPage/>
        <AboutSection />
        
        
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
