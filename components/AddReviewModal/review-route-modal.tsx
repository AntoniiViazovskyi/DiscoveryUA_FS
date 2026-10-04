"use client";

import { useRouter } from "next/navigation";

import AuthPromptModal from "@/components/AuthPromptModal/AuthPromptModal";

import { AddReviewSubmission } from "./add-review-submission";
import { locationHref, takeReviewOrigin } from "./review-navigation";

type ReviewRouteModalProps = {
  locationId: string;
  isAuthenticated: boolean;
};

export function ReviewRouteModal({
  locationId,
  isAuthenticated,
}: ReviewRouteModalProps) {
  const router = useRouter();

  function closeModal() {
    if (takeReviewOrigin(locationId)) {
      router.back();
      return;
    }

    router.replace(locationHref(locationId));
  }

  return isAuthenticated ? (
    <AddReviewSubmission locationId={locationId} onClose={closeModal} />
  ) : (
    <AuthPromptModal onClose={closeModal} />
  );
}
