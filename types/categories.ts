export const sort = [
  { value: "feedbacksCount", label: "За популярністю" },
  { value: "rate", label: "За рейтингом" },
  { value:"createdAt", label: "Новіші спочатку" },
];
export interface Region {
  _id: string;
  region: string;
  slug: string;
}
export interface Type {
  _id: string;
  type: string;
  slug: string;
}