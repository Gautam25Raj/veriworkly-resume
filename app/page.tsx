import { Container } from "@/components/layout/Container";

import TrustBar from "@/features/landing/components/TrustBar";
import CTASection from "@/features/landing/components/CTASection";
import HeroSection from "@/features/landing/components/HeroSection";
import FeaturesSection from "@/features/landing/components/FeaturesSection";
import TemplatesPreview from "@/features/landing/components/TemplatesPreview";

export default function Home() {
  return (
    <main className="surface-grid min-h-screen py-14 md:py-20">
      <Container className="space-y-12 md:space-y-16">
        <HeroSection />
        <TrustBar />
        <FeaturesSection />
        <TemplatesPreview />
        <CTASection />
      </Container>
    </main>
  );
}
