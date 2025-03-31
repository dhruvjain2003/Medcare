'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 3000); 

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px", minHeight: "68vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1>404 - Page Not Found</h1>
            <p>Redirecting to home...</p>
        </div>
    );
}
