import HeroSection from "@/components/sections/HeroSection";
import PresentationSection from "@/components/sections/PresentationSection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import BestsellersSection from "@/components/sections/BestsellersSection";
import WhyMonBarilSection from "@/components/sections/WhyMonBarilSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <PresentationSection />
      <CollectionsSection />
      <BestsellersSection />
      <WhyMonBarilSection />
      <ReviewsSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
  