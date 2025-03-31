"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useRouter,usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import styles from "./Header.module.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => {
    logout();
    // toast.success("Successfully logged out! 🎉");
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.leftSection}>
          <div className={styles.logo} onClick={() => router.push("/")}>
            <Image src="/images/Frame.png" alt="MedCare Logo" width={35} height={35} />
            <span>MedCare</span>
          </div>
          <div className={styles.navLinks}>
            <Link href="/" className={pathname === "/" ? styles.activeLink : ""}>Home</Link>
            <Link href="/appointments" className={pathname === "/appointments" ? styles.activeLink : ""}>Appointments</Link>
            <Link href="/health-blog" className={pathname === "/health-blog" ? styles.activeLink : ""}>Health Blog</Link>
            <Link href="/reviews" className={pathname === "/reviews" ? styles.activeLink : ""}>Reviews</Link>
          </div>
        </div>
        <div className={styles.mobileMenuIcon} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </div>
        <div className={styles.buttons}>
          {isLoggedIn ? (
            <>
              <div
                className={styles.userIcon}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUserCircle size={28} />
                {dropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                    <Link href="/my-appointments" onClick={() => setDropdownOpen(false)}>Appointments</Link>
                  </div>
                )}
              </div>
              <button className={styles.logout} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className={styles.login} onClick={() => router.push("/login")}>Login</button>
              <button className={styles.register} onClick={() => router.push("/signup")}>Register</button>
            </>
          )}
        </div>
      </div>

      <div className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/appointments" onClick={() => setMenuOpen(false)}>Appointments</Link>
        <Link href="/health-blog" onClick={() => setMenuOpen(false)}>Health Blog</Link>
        <Link href="/reviews" onClick={() => setMenuOpen(false)}>Reviews</Link>
        {isLoggedIn && (
          <>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link href="/my-appointments" onClick={() => setMenuOpen(false)}>My Appointments</Link>
          </>
        )}
        <div className={styles.mobileButtons}>
          {isLoggedIn ? (
            <button className={styles.logout} onClick={() => { setMenuOpen(false); handleLogout(); }}>Logout</button>
          ) : (
            <>
              <button className={styles.login} onClick={() => { setMenuOpen(false); router.push("/login"); }}>Login</button>
              <button className={styles.register} onClick={() => { setMenuOpen(false); router.push("/signup"); }}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;