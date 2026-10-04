import { isAxiosError } from "axios";
import { notFound } from "next/navigation";

import LocationDescription from "@/components/LocationDescription/LocationDescription";
import LocationGallery from "@/components/LocationGallery/LocationGallery";
import LocationInfoBlock from "@/components/LocationInfoBlock/LocationInfoBlock";
import { AddReviewSection } from "@/components/AddReviewModal/add-review-section";
import { fetchLocationById } from "@/lib/api/serverApi";

import styles from "./location-details-page.module.css";

type LocationDetailsPageProps = {
  params: Promise<{
    locationId: string;
  }>;
};

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export default async function LocationDetailsPage({
  params,
}: LocationDetailsPageProps) {
  const { locationId } = await params;

  if (!objectIdRegex.test(locationId)) {
    notFound();
  }

  let location;
  try {
    location = await fetchLocationById(locationId);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <div className="container">
        <section className={styles.headerSection}>
          <div className={styles.info}>
            <LocationInfoBlock location={location}/>
          </div>

          <div className={styles.gallery}>
            <LocationGallery image={location.image} name={location.name} />
          </div>
        </section>

        <section className={styles.descriptionSection}>
          <LocationDescription description={location.description} />
        </section>
      </div>
      <AddReviewSection locationId={locationId} />
    </>
  );
}
