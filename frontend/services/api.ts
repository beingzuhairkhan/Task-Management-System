
import { ProjectStatus } from "@/lib/projects-store";
import axios from "axios";
import type {
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:4000/api";

interface AxiosRequestConfigWithRetry
  extends AxiosRequestConfig {
  _retry?: boolean;
}

/* =========================
   AUTH API
========================= */

export const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Attach access token to every request.
 */
authAPI.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("accessToken");

    if (token) {
      config.headers =
        config.headers ?? {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }
  }

  return config;
});

/*
 * Refresh access token on 401.
 */
authAPI.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config as AxiosRequestConfigWithRetry;

    const isAuthRoute =
      originalRequest?.url?.includes(
        "/auth/refresh"
      );

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem(
            "refreshToken"
          );

        if (!refreshToken) {
          throw new Error(
            "No refresh token"
          );
        }

        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );

        const newAccessToken =
          res.data.accessToken;

        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        authAPI.defaults.headers.common.Authorization =
          `Bearer ${newAccessToken}`;

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization:
            `Bearer ${newAccessToken}`,
        };

        return authAPI(originalRequest);
      } catch {
        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        if (
          typeof window !== "undefined" &&
          window.location.pathname !==
          "/login"
        ) {
          window.location.replace(
            "/login"
          );
        }
      }
    }

    return Promise.reject(error);
  }
);


export type ProjectPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT"
  | "NO_PRIORITY";



export type ProjectRole =
  | "OWNER"
  | "MANAGER"
  | "MEMBER"
  | "VIEWER";


export interface ProjectMember {
  userId: string;
  role: ProjectRole;
  email?: string;
  username?: string;
  avatar?: string;
}


export interface Project {
  _id: string;
  title: string;
  description?: string;

  owner: string;

  lead: string;

  priority: ProjectPriority;
  status: ProjectStatus;

  startDate?: string;
  dueDate?: string;

  members?: ProjectMember[];

  createdAt?: string;
  updatedAt?: string;
}


// export interface CreateProjectDto {
//   title: string;
//   description?: string;
//   priority?: ProjectPriority;
//   status?: ProjectStatus;
//   lead: string;
//   dueDate: string;
// }


// export interface UpdateProjectDto {
//   title?: string;
//   description?: string;
//   priority?: string;
//   status?: string;
//   lead?: string;
//   dueDate?: string;
// }


export interface InviteMemberDto {
  email: string;
  role?: ProjectRole;
}


export interface UpdateMemberRoleDto {
  role: ProjectRole;
}


export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  priority?: ProjectPriority;
  status?: ProjectStatus;
}


export interface PaginatedProjects {
  data: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type UpdateUserData = {
  username?: string;
  fullName?: string;
  jobTitle?: string;
};

export const projectAPI = {

  createProject: (
    data: any
  ): Promise<AxiosResponse<Project>> => {
    return authAPI.post(
      "/projects",
      data
    );
  },

  findAllProject: (
    params?: PaginationParams
  ): Promise<AxiosResponse<any>> => {
    return authAPI.get("/projects", {
      params,
    });
  },

  findOneProject: (
    id: string
  ): Promise<AxiosResponse<Project>> => {
    return authAPI.get(
      `/projects/${id}`
    );
  },

  updateProjectById: (
    id: string,
    data: any
  ): Promise<AxiosResponse<Project>> => {
    return authAPI.patch(
      `/projects/${id}`,
      data
    );
  },

  remove: (
    id: string
  ): Promise<AxiosResponse<void>> => {
    return authAPI.delete(
      `/projects/${id}`
    );
  },

  /*
   * Invite member
   *
   * POST /projects/:id/members
   */
  inviteMember: (
    projectId: string,
    data: InviteMemberDto
  ): Promise<
    AxiosResponse<ProjectMember>
  > => {
    return authAPI.post(
      `/projects/${projectId}/members`,
      data
    );
  },

  /*
   * Update member role
   *
   * PATCH /projects/:id/members/:userId
   */
  updateMemberRole: (
    projectId: string,
    userId: string,
    data: UpdateMemberRoleDto
  ): Promise<
    AxiosResponse<ProjectMember>
  > => {
    return authAPI.patch(
      `/projects/${projectId}/members/${userId}`,
      data
    );
  },

  /*
   * Remove member
   *
   * DELETE /projects/:id/members/:userId
   */
  removeMember: (
    projectId: string,
    userId: string
  ): Promise<AxiosResponse<void>> => {
    return authAPI.delete(
      `/projects/${projectId}/members/${userId}`
    );
  },
};


export const userAPI = {
  findAllUsers: (
    params?: PaginationParams
  ): Promise<AxiosResponse> => {
    return authAPI.get("/users", { params });
  },

  updateUser: (
    data: UpdateUserData
  ): Promise<AxiosResponse> => {
    return authAPI.patch("/users/me", data);
  },

   inviteUser: (email:string) =>{
    return authAPI.post("/users/invite" , { email });
  }
}


export const labelAPI = {
  createLabel: (data: string) => {
    return authAPI.post("/labels", data);
  },

  getLabel: () => {
    return authAPI.get("/labels")
  }
}

export const taskAPI = {
  createTask: (projectId: string, data: any) => {
    return authAPI.post(`/projects/${projectId}/tasks`, data);
  },

  getTaskByProjectId: (projectId: string) => {
    return authAPI.get(`/projects/${projectId}/tasks`);
  },

  moveTask: (
    projectId: string,
    taskId: string,
    data: {
      groupId: string;
    },
  ) => {
    return authAPI.patch(
      `/projects/${projectId}/tasks/${taskId}/move`,
      data,
    );
  },

  getTaskById: (projectId: string, taskId: string) => {
    return authAPI.get(`/projects/${projectId}/tasks/${taskId}`);
  },

  updateTaskById: (projectId: string, taskId: string, data: any) => {
    return authAPI.patch(`/projects/${projectId}/tasks/${taskId}`, data);
  },

  deleteTask: (projectId: string, taskId: string) => {
    return authAPI.delete(`/projects/${projectId}/tasks/${taskId}`);
  },
}

export const subTaskAPI = {
  createSubTask: (taskId: string, data: any) => {
    return authAPI.post(`/tasks/${taskId}/subtasks`, data);
  },

  deleteSubTaskBYId: (taskId: string, subTaskId: string) => {
    return authAPI.delete(`/tasks/${taskId}/subtasks/${subTaskId}`);
  },

  updateSubTaskById: (
    taskId: string,
    subTaskId: string,
    data: {
        status?: string;
        priority?: string;
    },
) => {
    return authAPI.patch(
        `/tasks/${taskId}/subtasks/${subTaskId}`,
        data,
    );
},
};

export const auth = {
  logout: () => {
    return authAPI.post("/auth/logout");
  },

 
};

export const activityAPI = {
  getActivityByTaskId: (taskId: string) => {
    return authAPI.get(`/tasks/${taskId}/activity`);
  }
}

export const commentAPI = {
  createComment: (taskId: string, data: any) => {
    return authAPI.post(`/tasks/${taskId}/comments`, data);
  },

  getComments:(taskId:string) =>{
    return authAPI.get(`/tasks/${taskId}/comments`)
  },

  deleteComment: (taskId: string, commentId: string) => {
    return authAPI.delete(`/tasks/${taskId}/comments/${commentId}`);
  },

}