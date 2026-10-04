import { ReviewRouteModal } from "@/components/AddReviewModal/review-route-modal";
import { getReviewRouteState } from "@/components/AddReviewModal/review-route-state";

type ReviewModalPageProps = {
  params: Promise<{
    locationId: string;
  }>;
};

export default async function ReviewModalPage({
  params,
}: ReviewModalPageProps) {
  const { locationId } = await params;

  const { isAuthenticated } = await getReviewRouteState(locationId);

  return (
    <ReviewRouteModal
      locationId={locationId}
      isAuthenticated={isAuthenticated}
    />
  );
}
