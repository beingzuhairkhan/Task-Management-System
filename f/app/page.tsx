"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile-store";
import LoginPage from "./login/page";

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, loading } = useProfile();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.replace("/projects");
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return (<div className="flex min-h-screen items-center justify-center">
      Loading... </div>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return <LoginPage />;
}
