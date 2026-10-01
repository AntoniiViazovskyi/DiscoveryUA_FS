import * as Yup from 'yup'

export type RegistrationFormValues = {
  username: string
  email: string
  password: string
}

export const registrationFormSchema: Yup.ObjectSchema<RegistrationFormValues> =
  Yup.object({
    username: Yup.string()
      .trim()
      .min(3, 'Імʼя має містити щонайменше 3 символи')
      .max(32, 'Імʼя має містити не більше 32 символів')
      .required('Введіть імʼя'),
    email: Yup.string()
      .trim()
      .email('Введіть коректну електронну адресу')
      .max(64, 'Пошта має містити не більше 64 символів')
      .required('Введіть електронну адресу'),
    password: Yup.string()
      .min(8, 'Пароль має містити щонайменше 8 символів')
      .max(128, 'Пароль має містити не більше 128 символів')
      .required('Введіть пароль'),
  })
