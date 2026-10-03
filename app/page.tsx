import PopularLocationsBlock from "@/components/PopularLocationsBlock/PopularLocationsBlock";
import HeroBlock from "@/components/HeroBlock/HeroBlock";
import ReviewsBlock from "@/components/ReviewsBlock/ReviewsBlock";
import AdvantagesBlock from "@/components/AdvantagesBlock/AdvantagesBlock";

export default function HomePage() {
  return (
    <main className="workspace container">
      <p className="eyebrow">Final Team Project</p>
      <h1>Frontend workspace is ready.</h1>
      <p>
        The shared structure and dependencies are configured. Replace this page
        when product development begins.
      </p>
      <HeroBlock />
      <AdvantagesBlock />
      <PopularLocationsBlock />
      <ReviewsBlock />
    </main>
  );
}
