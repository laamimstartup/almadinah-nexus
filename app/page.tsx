import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ThreePillars from "@/components/landing/ThreePillars";
import EliteFeatures from "@/components/landing/EliteFeatures";
import ProgramsSection from "@/components/landing/ProgramsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-nexus-bg">
      <Navbar />
      <HeroSection />
      <ThreePillars />
      <EliteFeatures />
      <ProgramsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
