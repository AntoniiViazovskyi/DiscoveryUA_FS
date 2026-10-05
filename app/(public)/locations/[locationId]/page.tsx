import type { Metadata } from "next";
import { isAxiosError } from "axios";
import { notFound } from "next/navigation";

import LocationDescription from "@/components/LocationDescription/LocationDescription";
import LocationGallery from "@/components/LocationGallery/LocationGallery";
import LocationInfoBlock from "@/components/LocationInfoBlock/LocationInfoBlock";
import LocationMap from "@/components/LocationMap/LocationMap";
import { AddReviewSection } from "@/components/AddReviewModal/add-review-section";
import { fetchLocationById } from "@/lib/api/serverApi";

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

  try {
    location = await fetchLocationById(locationId);
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
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/locations/${locationId}`,
    },
    openGraph: {
      title: location.name,
      description: location.description?.slice(0, 160),
      url: `${process.env.NEXT_PUBLIC_APP_URL}/locations/${locationId}`,
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
