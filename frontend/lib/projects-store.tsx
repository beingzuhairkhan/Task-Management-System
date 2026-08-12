
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import type { Member } from "@/lib/tasks-data";


export type Project = {
    id: string;
    name: string;
    description: string;
    priority: TaskPriority;
    status: string;
    lead: Member;
    due: string;
};


export enum ProjectStatus {
    PLANNING = "PLANNING",
    ACTIVE = "ACTIVE",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
}


export const projectStatuses = Object.values(ProjectStatus);


export type NewProject = {
    name: string;
    description?: string;
    priority?: TaskPriority;
    status?: string;
    lead?: Member;
    due?: string;
};


type ProjectsContextValue = {
    projects: Project[];
    getProject: (id: string) => Project | undefined;
    createProject: (input: NewProject) => Project;
    updateProject: (
        id: string,
        patch: Partial<Project>
    ) => void;
    deleteProject: (id: string) => void;
};


const STORAGE_KEY = "dexter.projects.v1";


const ProjectsContext =
    createContext<ProjectsContextValue | null>(null);


const uid = () =>
    `${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;


export function ProjectsProvider({
    children,
}: {
    children: ReactNode;
}) {
    // No static projects.
    const [projects, setProjects] = useState<Project[]>([]);

    const [hydrated, setHydrated] = useState(false);


    useEffect(() => {
        try {
            const raw =
                window.localStorage.getItem(
                    STORAGE_KEY
                );

            if (raw) {
                const parsed = JSON.parse(raw);

                if (Array.isArray(parsed)) {
                    setProjects(
                        parsed as Project[]
                    );
                }
            }
        } catch (error) {
            console.error(
                "Failed to load projects:",
                error
            );
        } finally {
            setHydrated(true);
        }
    }, []);



    useEffect(() => {
        if (!hydrated) return;

        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(projects)
            );
        } catch (error) {
            console.error(
                "Failed to save projects:",
                error
            );
        }
    }, [projects, hydrated]);


    const value = useMemo<ProjectsContextValue>(
        () => ({
            projects,


            getProject: (id: string) => {
                return projects.find(
                    (project) =>
                        project.id === id
                );
            },


            createProject: (
                input: NewProject
            ) => {
                const project: Project = {
                    id: uid(),

                    name:
                        input.name.trim() ||
                        "Untitled project",

                    description:
                        input.description?.trim() ??
                        "",

                    priority:
                        input.priority ??
                        "Medium",

                    status:
                        input.status ??
                        "Planning",

                    lead:
                        input.lead ??
                        ({} as Member),

                    due:
                        input.due?.trim() ||
                        "No due date",
                };


                setProjects(
                    (prev) => [
                        ...prev,
                        project,
                    ]
                );


                return project;
            },


            updateProject: (
                id: string,
                patch: Partial<Project>
            ) => {
                setProjects(
                    (prev) =>
                        prev.map(
                            (project) =>
                                project.id === id
                                    ? {
                                          ...project,
                                          ...patch,
                                      }
                                    : project
                        )
                );
            },


            deleteProject: (
                id: string
            ) => {
                setProjects(
                    (prev) =>
                        prev.filter(
                            (project) =>
                                project.id !== id
                        )
                );
            },
        }),
        [projects]
    );

    return (
        <ProjectsContext.Provider
            value={value}
        >
            {children}
        </ProjectsContext.Provider>
    );
}


export function useProjects(): ProjectsContextValue {
    const context =
        useContext(ProjectsContext);

    if (!context) {
        throw new Error(
            "useProjects must be used inside ProjectsProvider"
        );
    }

    return context;
}

