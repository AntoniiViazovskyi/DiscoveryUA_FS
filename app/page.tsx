import PopularLocationsBlock from "@/components/PopularLocationsBlock/PopularLocationsBlock";
import HeroBlock from "@/components/HeroBlock/HeroBlock";
import ReviewsBlock from "@/components/ReviewsBlock/ReviewsBlock";
import AdvantagesBlock from "@/components/AdvantagesBlock/AdvantagesBlock";

export default function HomePage() {
  return (
    <main>
      <HeroBlock />
      <AdvantagesBlock />
      <PopularLocationsBlock />
      <ReviewsBlock />
    </main>
  );
}
