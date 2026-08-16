"use client";

import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  FolderClosed,
  LayoutGrid,
  Moon,
  Palette,
  Plus,
  Settings,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/profile-store";
import { accents, useTheme } from "@/lib/theme";
import {  userAPI } from "@/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


// import { userAPI } from "@/lib/api";

const nav = [
  {
    label: "Tasks",
    icon: LayoutGrid,
    to: "/",
  },
  {
    label: "Projects",
    icon: FolderClosed,
    to: "/projects",
  },
] as const;

type AppSidebarProps = {
  open: boolean;
  active: "tasks" | "projects";
};

export function AppSidebar({ open, active }: AppSidebarProps) {
  const { profile } = useProfile();
  const { mode, setMode, accent, setAccent } = useTheme();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setLoading(true);

      await userAPI.inviteUser(email.trim());

      toast.success("Invitation sent successfully");

      setEmail("");
      setInviteOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send invitation",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <aside
        className={cn(
          "shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200",
          open ? "w-60" : "w-0",
        )}
      >
        <div className="flex h-screen w-60 flex-col">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 border-b border-sidebar-border px-3 py-3 text-left transition-colors hover:bg-sidebar-accent">
              <span className="flex size-7 items-center justify-center overflow-hidden rounded-full bg-avatar-violet text-[11px] font-bold text-avatar-violet-foreground">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username ?? "User"}
                    className="size-full object-cover"
                  />
                ) : (
                  profile?.initials
                )}
              </span>

              <span className="flex-1 truncate text-sm font-semibold text-sidebar-foreground">
                {profile.username}
              </span>

              <ChevronsUpDown className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <div className="flex flex-col items-center gap-1 px-2 py-3">
                <span className="flex size-7 items-center justify-center overflow-hidden rounded-full bg-avatar-violet text-[11px] font-bold text-avatar-violet-foreground">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.username ?? "User"}
                      className="size-full object-cover"
                    />
                  ) : (
                    profile.initials
                  )}
                </span>

                <span className="text-xs text-muted-foreground">
                  {profile.email}
                </span>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {mode === "dark" ? (
                    <Moon className="size-4" />
                  ) : (
                    <Sun className="size-4" />
                  )}
                  Change Theme
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  {(["light", "dark"] as const).map((m) => (
                    <DropdownMenuItem
                      key={m}
                      className="justify-between capitalize"
                      onSelect={() => setMode(m)}
                    >
                      <span className="flex items-center gap-2">
                        {m === "dark" ? (
                          <Moon className="size-4" />
                        ) : (
                          <Sun className="size-4" />
                        )}
                        {m}
                      </span>

                      {mode === m && (
                        <Check className="size-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="size-4" />
                  Color Mode
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  {accents.map((a) => (
                    <DropdownMenuItem
                      key={a.id}
                      className="justify-between"
                      onSelect={() => setAccent(a.id)}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "size-3 rounded-sm",
                            a.swatch,
                          )}
                        />
                        {a.label}
                      </span>

                      {accent === a.id && (
                        <Check className="size-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <nav className="flex-1 px-2 py-3">
            <button className="mb-1 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Workspace
              <ChevronDown className="size-3.5" />
            </button>

            <ul className="space-y-0.5">
              {nav.map(({ label, icon: Icon, to }) => (
                <li key={label}>
                  <Link
                    href={to}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      active === label.toLowerCase()
                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-sidebar-border p-2">
            <button
              onClick={() => setInviteOpen(true)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <Plus className="size-4" />
              Invite people
            </button>
          </div>
        </div>
      </aside>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="w-[360px]">
          <DialogHeader>
            <DialogTitle>Invite people</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              disabled={loading}
            />

            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

