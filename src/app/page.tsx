import HeaderBis from "@/components/sections/Header";
import CollectionsSection from "@/components/sections/CollectionsSection";
import BestsellersBis from "@/components/sections/BestsellersBis";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import Ambition from "@/components/sections/Ambition";
import Selection from "@/components/sections/Selection";
import Reveal from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeaderBis />
      <BestsellersBis />
      <CollectionsSection />
      <Reveal>
        <Ambition />
      </Reveal>
      <Reveal>
        <Selection />
      </Reveal>
      <Reveal>
        <ReviewsSection />
      </Reveal>
      <Reveal>
        <ContactSection />
      </Reveal>
      <Footer />
    </main>
  );
}
  