import type { Metadata } from "next";
import { isAxiosError } from "axios";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

import LocationDescription from "@/components/LocationDescription/LocationDescription";
import LocationGallery from "@/components/LocationGallery/LocationGallery";
import LocationInfoBlock from "@/components/LocationInfoBlock/LocationInfoBlock";
import LocationMap from "@/components/LocationMap/LocationMap";
import { AddReviewSection } from "@/components/AddReviewModal/add-review-section";
import { getLocationByIdCached } from "@/lib/api/serverApi";

import styles from "./location-details-page.module.css";

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

  if (!objectIdRegex.test(locationId)) {
    return {
      title: "Локацію не знайдено",
      description: "Запитувану локацію не знайдено.",
    };
  }

  let location;
  const locationUrl = new URL(`/locations/${locationId}`, SITE_URL);

  try {
    location = await getLocationByIdCached(locationId);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return {
        title: "Локацію не знайдено",
        description: "Запитувану локацію не знайдено.",
      };
    }

    throw error;
  }

  return {
    title: location.name,
    description: location.description?.slice(0, 160),

    alternates: {
      canonical: locationUrl,
    },
    openGraph: {
      title: location.name,
      description: location.description?.slice(0, 160),
      url: locationUrl,
      siteName: SITE_NAME,
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
      description: location.description?.slice(0, 160),
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
    location = await getLocationByIdCached(locationId);
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
            <LocationInfoBlock location={location} />
          </div>

          <div className={styles.gallery}>
            <LocationGallery image={location.image} name={location.name} />
          </div>
        </section>

        <section className={styles.descriptionSection}>
          <LocationDescription description={location.description} />
        </section>

        <section className={styles.mapSection}>
          <LocationMap
            coordinates={location.coordinates}
            name={location.name}
          />
        </section>
      </div>

      <AddReviewSection locationId={locationId} />
    </>
  );
}
