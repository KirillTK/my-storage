import { LandingHeader } from "../widgets/landing-header/ui";
import { LandingFooter } from "../widgets/landing-footer/ui";
import { HeroSection } from "../widgets/hero-section/ui/hero-section";

export default async function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <LandingHeader />
      {/* Hero Section */}
      <HeroSection />
      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
