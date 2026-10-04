import { redirect } from 'next/navigation'

type DirectReviewRouteProps = {
  params: Promise<{ locationId: string }>
}

export default async function DirectReviewRoute({ params }: DirectReviewRouteProps) {
  const { locationId } = await params
  redirect(`/locations/${encodeURIComponent(locationId)}`)
}