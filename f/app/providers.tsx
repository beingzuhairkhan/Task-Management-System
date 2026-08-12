"use client";

import { ThemeProvider } from "@/lib/theme";
import { ProfileProvider } from "@/lib/profile-store";
import { ProjectsProvider } from "@/lib/projects-store";
import { TasksProvider } from "@/lib/tasks-store";
import { Toaster } from "sonner";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <ProjectsProvider>
          <TasksProvider>
            {children}
            <Toaster />
          </TasksProvider>
        </ProjectsProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}