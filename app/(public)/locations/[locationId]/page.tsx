import type { Metadata } from "next";
import { isAxiosError } from "axios";
import { notFound } from "next/navigation";

import LocationDescription from "@/components/LocationDescription/LocationDescription";
import LocationGallery from "@/components/LocationGallery/LocationGallery";
import LocationInfoBlock from "@/components/LocationInfoBlock/LocationInfoBlock";
// import ReviewsSection from "@/components/ReviewsSection/ReviewsSection";
import { fetchLocationById } from "@/lib/api/serverApi";

import styles from "./location-details-page.module.css";
import { getAllRegionsServer, getAllTypesServer } from "@/lib/api/filterServer";

type LocationDetailsPageProps = {
  params: Promise<{
    locationId: string;
  }>;
};

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export async function generateMetadata({
  params,
}: LocationDetailsPageProps): Promise<Metadata> {
  const { locationId } = await params;

  const location = await fetchLocationById(locationId);

  return {
    title: location.name,
    description: location.description?.slice(0, 30),

    alternates: {
      canonical: `https://final-team-project-fs.vercel.app/locations/${locationId}`,
    },
    openGraph: {
      title: location.name,
      description: location.description?.slice(0, 30),
      url: `https://final-team-project-fs.vercel.app/locations/${locationId}`,
      siteName: "RelaxMap",
      images: location.image
        ? [
            {
              url: location.image,
              width: 1200,
              height: 630,
              alt: location.name,
            },
          ]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: location.name,
      description: location.description?.slice(0, 30),
      images: location.image ? [location.image] : [],
    },
  };
}

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

const [types, regions] = await Promise.all([
  getAllTypesServer(),
  getAllRegionsServer(),
]);

  return (
    <div className="container">
      <section className={styles.headerSection}>
        <div className={styles.info}>
          <LocationInfoBlock location={location} regions={regions} types={types} />
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
