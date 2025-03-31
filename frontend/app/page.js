"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { toast, Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";

const HomeContent = () => {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log("Backend URL:", backendURL);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const toastShown = useRef(false); 
  const router = useRouter();

  useEffect(() => {
    if (message === "success" && !toastShown.current) {
      toast.success("Login was successful! 🎉");
      toastShown.current = true; 
    }
  }, [message]); 

  return (
    <section className={styles.heroSection}>
      <Toaster position="top-right" reverseOrder={false} />
      <div className={styles.heroContent}>
        <h1>Health in Your Hands.</h1>
        <p>
          Take control of your healthcare with CareMate. Book appointments with
          ease, explore health blogs, and stay on top of your well-being, all in
          one place.
        </p>
        <button className={styles.heroButton} onClick={() => router.push("/appointments")}>
          Get Started
        </button>
      </div>
      <div className={styles.heroImageContainer}>
        <Image
          src="/images/nurse.png"
          alt="Doctor and Patient"
          width={800}
          height={900}
          className={styles.heroImage}
          priority
        />
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
