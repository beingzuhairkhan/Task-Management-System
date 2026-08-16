"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProfile } from "@/lib/profile-store";
import { Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      console.error("Google authentication error:", error);
    }
  }, [searchParams]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Triangle className="size-3.5 fill-current" />
        </span>

        <span className="text-sm font-semibold">
          Dexter
        </span>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-card">
        <h1 className="text-lg font-semibold tracking-tight">
          Let's get back on track
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter your workspace to pick up where you left off.
        </p>

        <div className="mt-5 space-y-2.5">

          <Button
            variant="outline"
            className="w-full gap-2 rounded-full"
            onClick={loginWithGoogle}
          >
            <GoogleIcon />
            Login with Google
          </Button>
        </div>
      </div>

    </main>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"
      />

      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"
      />

      <path
        fill="#FBBC05"
        d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1z"
      />

      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
      />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, loading } = useProfile();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.replace("/projects");
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-canvas">
          <div className="text-sm text-muted-foreground">
            Loading...
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}