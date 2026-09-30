import * as Yup from 'yup'

export type AddReviewFormValues = {
  rate: number
  description: string
}

export const addReviewSchema: Yup.ObjectSchema<AddReviewFormValues> =
  Yup.object({
    rate: Yup.number()
      .integer('Оцінка має бути цілим числом')
      .min(1, 'Оберіть оцінку від 1 до 5')
      .max(5, 'Оберіть оцінку від 1 до 5')
      .required('Оберіть оцінку від 1 до 5'),
    description: Yup.string()
      .trim()
      .required('Напишіть відгук')
      .max(200, 'Відгук має містити не більше 200 символів'),
  })
