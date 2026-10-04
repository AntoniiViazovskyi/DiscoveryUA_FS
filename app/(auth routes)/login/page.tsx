import type { Metadata } from "next";

import AuthNav from "@/components/AuthNav/AuthNav";
import LoginForm from "@/components/LoginForm/LoginForm";

import styles from "./login-page.module.css";

export const metadata: Metadata = {
  title: "Вхід",
  description: "Увійти в обліковий запис Relax Map.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <section className={styles.content} aria-labelledby="login-title">
      <div className={styles.authPanel}>
        <AuthNav active="login" />

        <div className={styles.formPane}>
          <h1 className={styles.title} id="login-title">
            Вхід
          </h1>

          <LoginForm />
        </div>
      </div>
    </section>
  );
}
