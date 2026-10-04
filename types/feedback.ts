export type Feedback = {
  _id: string
  rate: number
  description: string
  authorName: string
  locationId: string
  locationName: string
  locationType?: string
}