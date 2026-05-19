import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { GameGrid } from "@/components/site/GameGrid";
import { FeaturesSection } from "@/components/site/FeaturesSection";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeonTopUp — Top Up Game & Jasa Joki Cepat, Aman, Terpercaya" },
      {
        name: "description",
        content:
          "Top up game termurah & jasa joki anti-ban untuk Mobile Legends, Free Fire, PUBG, Valorant, Genshin, dan lainnya. Proses detik, support 24/7.",
      },
      { property: "og:title", content: "NeonTopUp — Top Up Game & Jasa Joki Terpercaya" },
      {
        property: "og:description",
        content: "Top up cepat & joki aman untuk semua game favorit kamu. Support 24/7.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pb-8">
        <HeroCarousel />
        <GameGrid />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
