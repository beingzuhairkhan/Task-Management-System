"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Search,
  User,
  Sun,
  Palette,
  Check,
  Moon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useProfile } from "@/lib/profile-store";
import { accents, useTheme } from "@/lib/theme";

import { toast } from "sonner";
import { userAPI , auth } from "../../services/api";

const sections = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "theme",
    label: "Theme",
    icon: Sun,
  },
  {
    id: "color",
    label: "Color",
    icon: Palette,
  },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function SettingsPage() {
  const { profile, updateProfile } = useProfile();

  const { mode, setMode, accent, setAccent } = useTheme();

  const [section, setSection] = useState<SectionId>("profile");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = sections.filter((item) =>
    search
      ? item.label.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const handleSaveProfile = async () => {
    if (!profile?.id) {
      toast.error("User ID is missing");
      return;
    }

    try {
      setSaving(true);

      await userAPI.updateUser({
        username: profile.username,
        fullName: profile.fullName,
        jobTitle: profile.jobTitle,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };


const handleLogout = async () => {
  try {
    await auth.logout();

    toast.success("Logged out successfully");
     localStorage.removeItem("accessToken");

    // Optional: redirect after logout
    window.location.href = "/login";
  } catch (error) {
    console.error(error);
    toast.error("Failed to logout");
  }
};

  return (
    <div className="flex min-h-screen">
      {/* Settings Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar md:block">
        <div className="sticky top-0 p-4">
          {/* Back */}
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to app
          </Link>

          {/* Search */}
          <div className="mb-4 flex items-center gap-2 rounded-md border border-border bg-card px-2">
            <Search className="size-4 shrink-0 text-muted-foreground" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Sections */}
          <nav className="space-y-0.5">
            {filtered.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSection(id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  section === id
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background px-4 py-10 md:px-16">
        <div className="mx-auto max-w-2xl">
          {/* Profile */}
          {section === "profile" && (
            <section>
              <h1 className="mb-6 text-xl font-semibold tracking-tight">
                Profile
              </h1>

              <div className="divide-y divide-border rounded-xl border border-border bg-card">
         
                <Row label="Profile picture">
                  <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-avatar-violet text-[11px] font-bold text-avatar-violet-foreground ">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.username ?? "User"}
                        className="size-full object-cover"
                      />
                    ) : (
                       profile.initials 
                      
                    )}
                  </div>
                </Row>

          
                <Row label="Email">
                  <Input
                    value={profile.email}
                    disabled
                    className="h-8 w-56 cursor-not-allowed bg-muted text-muted-foreground"
                  />
                </Row>

              
                <Row label="Full name">
                  <Input
                    value={profile.fullName ?? ""}
                    onChange={(event) =>
                      updateProfile({
                        fullName: event.target.value,
                      })
                    }
                    className="h-8 w-56"
                  />
                </Row>

                
                <Row
                  label="Job title"
                  hint="Your job title or role"
                >
                  <Input
                    value={profile.jobTitle ?? ""}
                    onChange={(event) =>
                      updateProfile({
                        jobTitle: event.target.value,
                      })
                    }
                    className="h-8 w-56"
                  />
                </Row>

             
                <Row
                  label="Username"
                  hint="One word, like a nickname or first name"
                >
                  <Input
                    value={profile.username ?? ""}
                    onChange={(event) =>
                      updateProfile({
                        username: event.target.value,
                      })
                    }
                    className="h-8 w-56"
                  />
                </Row>
              </div>

             
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>

              {/* Workspace Access */}
              <h2 className="mb-4 mt-10 text-base font-semibold">
                Workspace access
              </h2>

              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
                <span className="text-sm text-muted-foreground">
                  Remove yourself from the workspace
                </span>

              <Button
  variant="ghost"
  className="bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive"
  onClick={handleLogout}
>
  Leave Workspace
</Button>
              </div>
            </section>
          )}

          {/* Theme */}
          {section === "theme" && (
            <section>
              <h1 className="mb-6 text-xl font-semibold tracking-tight">
                Theme
              </h1>

              <div className="grid grid-cols-2 gap-3">
                {(["light", "dark"] as const).map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => setMode(theme)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border bg-card px-4 py-4 text-sm font-medium capitalize transition-colors",
                      mode === theme
                        ? "border-primary"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {theme === "dark" ? (
                        <Moon className="size-4" />
                      ) : (
                        <Sun className="size-4" />
                      )}

                      {theme}
                    </span>

                    {mode === theme && (
                      <Check className="size-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Color */}
          {section === "color" && (
            <section>
              <h1 className="mb-6 text-xl font-semibold tracking-tight">
                Color
              </h1>

              <div className="grid gap-2 sm:grid-cols-2">
                {accents.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAccent(item.id)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border bg-card px-4 py-3 text-sm font-medium transition-colors",
                      accent === item.id
                        ? "border-primary"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-4 rounded-md",
                          item.swatch
                        )}
                      />

                      {item.label}
                    </span>

                    {accent === item.id && (
                      <Check className="size-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div>
        <div className="text-sm font-medium">{label}</div>

        {hint && (
          <div className="mt-0.5 text-xs text-muted-foreground">
            {hint}
          </div>
        )}
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

