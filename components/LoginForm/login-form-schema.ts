import * as Yup from "yup";

export type LoginFormValues = {
  email: string;
  password: string;
};

export const loginFormSchema: Yup.ObjectSchema<LoginFormValues> = Yup.object({
  email: Yup.string()
    .trim()
    .email("Введіть коректну електронну адресу")
    .max(64, "Пошта має містити не більше 64 символів")
    .required("Введіть електронну адресу"),

  password: Yup.string()
    .min(8, "Пароль має містити щонайменше 8 символів")
    .max(128, "Пароль має містити не більше 128 символів")
    .required("Введіть пароль"),
});
