import Features from "@/components/tailark/features-2";
import StatsSection from "@/components/tailark/stats";
import WallOfLoveSection from "@/components/tailark/testimonials";
import FAQs from "@/components/tailark/faqs";
import CallToAction from "@/components/tailark/call-to-action";
import MonthlyAnnualPricing from "@/components/website/monthly-annual-pricing";
import HeroSection from "@/components/tailark/hero-section";
import { HeroHeader } from "@/components/tailark/header";
import Footer from "@/components/tailark/footer";

export default function WebsiteHomepage() {
  return (
    <>
      <HeroHeader />
      <main className="relative z-10">
        <HeroSection />
        <Features />
        <WallOfLoveSection />
        <StatsSection />
        <MonthlyAnnualPricing />
        <FAQs />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
