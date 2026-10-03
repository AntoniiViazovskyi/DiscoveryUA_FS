"use client";

import { useId } from "react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import { login } from "@/lib/api/clientApi";
import Button from "@/components/Button/Button";

import { loginFormSchema, LoginFormValues } from "./login-form-schema";

import styles from "./LoginForm.module.css";

const INITIAL_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const router = useRouter();
  const formId = useId();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      toast.success("Вхід успішний.");

      router.push("/profile");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Не вдалося увійти. Перевірте пошту та пароль.",
      );
    }
  };

  return (
    <>
      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={loginFormSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting, touched }) => (
          <Form className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-email`}>
                Пошта*
              </label>

              <Field
                className={styles.input}
                id={`${formId}-email`}
                name="email"
                type="email"
                placeholder="hello@relaxmap.ua"
                autoComplete="email"
                aria-describedby={`${formId}-email-error`}
                aria-invalid={Boolean(touched.email && errors.email)}
              />

              <p
                className={styles.error}
                id={`${formId}-email-error`}
                role="alert"
              >
                {touched.email ? errors.email : ""}
              </p>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-password`}>
                Пароль*
              </label>

              <Field
                className={styles.input}
                id={`${formId}-password`}
                name="password"
                type="password"
                placeholder="********"
                autoComplete="current-password"
                aria-describedby={`${formId}-password-error`}
                aria-invalid={Boolean(touched.password && errors.password)}
              />

              <p
                className={styles.error}
                id={`${formId}-password-error`}
                role="alert"
              >
                {touched.password ? errors.password : ""}
              </p>
            </div>

            <Button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Входимо..." : "Увійти"}
            </Button>
          </Form>
        )}
      </Formik>

      <Toaster position="top-right" />
    </>
  );
}
