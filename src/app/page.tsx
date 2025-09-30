import HeaderBis from "@/components/sections/Header";
import CollectionsSection from "@/components/sections/CollectionsSection";
import BestsellersSection from "@/components/sections/BestsellersSection";
import BestsellersBis from "@/components/sections/BestsellersBis";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import Ambition from "@/components/sections/Ambition";
import Selection from "@/components/sections/Selection";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeaderBis />
      <BestsellersBis />
      <CollectionsSection />
      <Ambition />
      <Selection />
      <ReviewsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
  