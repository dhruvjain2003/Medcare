"use client"
import styles from "./Footer.module.css";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const handlePhoneClick = () => {
    router.push("/emergency-contact"); 
  };

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>© EmScripts 2024. All Right Reserved.</p>
      <div className={styles.icons}>
        <FaPhone className={styles.icon} onClick={handlePhoneClick}/>
        <FaWhatsapp className={styles.icon} />
      </div>
    </footer>
  );
}
