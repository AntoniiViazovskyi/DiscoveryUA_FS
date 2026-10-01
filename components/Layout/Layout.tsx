import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
      <Footer />
    </>
  );
}
