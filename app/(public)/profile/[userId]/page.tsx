import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { isAxiosError } from "axios";

import { ProfileInfo } from "@/components/ProfileInfo/ProfileInfo";
import { ProfilePlaceholder } from "@/components/ProfilePlaceholder/ProfilePlaceholder";
import ProfileLocationsGrid from "@/components/ProfileLocationsGrid/ProfileLocationsGrid";
import {
  getCurrentUser,
  getPublicUser,
  getUserLocations,
  ProfileApiUnavailableError,
} from "@/lib/api/profile";
import { SITE_NAME } from "@/lib/seo";
import type { Location } from "@/types/location";
import type { Type } from "@/types/categories";
import { getAllTypesServer } from "@/lib/api/filterServer";

import styles from "./profile-page.module.css";

const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

type Props = {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ count?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;

  if (!OBJECT_ID_REGEX.test(userId)) {
    return { title: "Профіль не знайдено" };
  }

  const user = await getPublicUser(userId).catch(() => null);

  const displayName = user?.name?.trim() || user?.username || "Профіль";

  return {
    title: displayName,
    description: `Профіль користувача ${displayName} на ${SITE_NAME}.`,
    alternates: {
      canonical: `/profile/${userId}`,
    },
  };
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const { userId: rawUserId } = await params;
  const { count: countParam } = await searchParams;

  if (!OBJECT_ID_REGEX.test(rawUserId)) {
    notFound();
  }

  const userId = rawUserId.toLowerCase();
  const parsedCount = Number(
    Array.isArray(countParam) ? countParam[0] : countParam,
  );
  const requestedPages =
    Number.isSafeInteger(parsedCount) && parsedCount > 0 ? parsedCount : 1;

  let profileUser;
  let currentUser = null;
  let locations: Location[] = [];
  let locationTypes: Type[] = [];
  let total = 0;
  let totalPages = 0;

  try {
    const [
      currentUserResult,
      profileUserResult,
      firstPage,
      locationTypesResult,
    ] = await Promise.all([
      getCurrentUser().catch(() => null),
      getPublicUser(userId),
      getUserLocations(userId, 1),
      getAllTypesServer().catch(() => []),
    ]);

    currentUser = currentUserResult;
    profileUser = profileUserResult;

    if (!profileUser) {
      notFound();
    }

    total = firstPage.total;
    totalPages = firstPage.totalPages;
    locations = firstPage.data;
    locationTypes = locationTypesResult;

    const pagesToLoad = Math.min(requestedPages, totalPages);

    if (pagesToLoad > 1) {
      const nextPages = await Promise.all(
        Array.from({ length: pagesToLoad - 1 }, (_, index) =>
          getUserLocations(userId, index + 2),
        ),
      );
      locations = [...locations, ...nextPages.flatMap((result) => result.data)];
    }
  } catch (err) {
    if (
      err instanceof ProfileApiUnavailableError ||
      (isAxiosError(err) && (err.response?.status ?? 0) >= 500)
    ) {
      return (
        <main className="container">
          <div className={styles.page}>
            <div className={styles.notice}>
              <p>Не вдалося завантажити профіль. Спробуйте пізніше.</p>
            </div>
          </div>
        </main>
      );
    }
    throw err;
  }

  const isOwner = currentUser?._id === userId;
  const loadedPages = Math.min(requestedPages, totalPages);
  const hasMore = loadedPages < totalPages;

  return (
    <main className="container">
      <div className={styles.page}>
        <ProfileInfo
          user={profileUser}
          locationsAmount={total}
          isOwner={isOwner}
        />

        <section
          className={styles.section}
          aria-label={isOwner ? "Мої локації" : "Локації користувача"}
        >
          {locations.length > 0 ? (
            <>
              <ProfileLocationsGrid
                locations={locations}
                locationTypes={locationTypes}
                isOwner={isOwner}
              />

              {hasMore && (
                <Link
                  href={`/profile/${userId}?count=${loadedPages + 1}`}
                  scroll={false}
                  className={styles.loadMoreButton}
                >
                  Показати ще
                </Link>
              )}
            </>
          ) : (
            <ProfilePlaceholder isOwner={isOwner} />
          )}
        </section>
      </div>
    </main>
  );
}
