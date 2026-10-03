import LocationDescription from "@/components/LocationDescription/LocationDescription";
import LocationGallery from "@/components/LocationGallery/LocationGallery";
import LocationInfoBlock from "@/components/LocationInfoBlock/LocationInfoBlock";
// import ReviewsSection from "@/components/ReviewsSection/ReviewsSection";
import { fetchLocationById } from "@/lib/api/serverApi";

import styles from "./location-details-page.module.css";

type LocationDetailsPageProps = {
  params: Promise<{
    locationId: string;
  }>;
};

export default async function LocationDetailsPage({
  params,
}: LocationDetailsPageProps) {
  const { locationId } = await params;

  const location = await fetchLocationById(locationId);

  return (
    <div className="container">
      <section className={styles.headerSection}>
        <div className={styles.info}>
          <LocationInfoBlock />
        </div>

        <div className={styles.gallery}>
          <LocationGallery image={location.image} name={location.name} />
        </div>
      </section>

      <section className={styles.descriptionSection}>
        <LocationDescription description={location.description} />
      </section>
      {/* <section className={styles.reviewsSection}>
        <ReviewsSection />
      </section> */}
    </div>
  );
}
