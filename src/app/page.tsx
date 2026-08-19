import type { Metadata } from "next";
import HeaderBis from "@/components/sections/Header";
import ProductSpotlight from "@/components/sections/ProductSpotlight";
import BarrelHotspots from "@/components/sections/BarrelHotspots";
import Thermolaquage from "@/components/sections/Thermolaquage";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import Ambition from "@/components/sections/Ambition";
import Selection from "@/components/sections/Selection";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeaderBis />
      <ProductSpotlight />
      <BarrelHotspots />
      <Thermolaquage />
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
  