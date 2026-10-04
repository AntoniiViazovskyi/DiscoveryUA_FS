let reviewOrigin: string | null = null

export function locationHref(locationId: string) {
  return `/locations/${encodeURIComponent(locationId)}`
}

export function rememberReviewOrigin(locationId: string) {
  const href = locationHref(locationId)
  reviewOrigin = window.location.pathname === href ? href : null
}

export function takeReviewOrigin(locationId: string) {
  const matches = reviewOrigin === locationHref(locationId)
  reviewOrigin = null
  return matches
}
