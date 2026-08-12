import axios, { AxiosResponse } from "axios";
import { getApiKey } from "@/utils/common";
import type {
  ApplicationDetail,
  ApplicationListResult,
  ApplicationType,
  EducationEntry,
  SkillEntry,
  UserAccount,
  UserProfile,
  WorkHistoryEntry,
} from "@/utils/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const client = axios.create({ baseURL: `${API_BASE_URL}/api/v1` });

client.interceptors.request.use((config) => {
  const key = getApiKey();
  if (key) {
    config.headers.Authorization = `Bearer ${key}`;
  }
  return config;
});

// /users and /profile endpoints return their schema directly.
function raw<T>(res: AxiosResponse<T>): T {
  return res.data;
}

// /resume, /jobs, and /applications endpoints wrap the payload in
// {status, message, data}.
function unwrap<T>(res: AxiosResponse<{ status: string; message: string; data: T }>): T {
  return res.data.data;
}

interface JobIngestionResult {
  status: string;
  chunks_ingested: number;
  title: string;
  job_posting_id: string;
}

export const api = {
  // Auth
  register: (email: string, full_name?: string) =>
    client.post("/users", { email, full_name }).then(raw<{ id: string; email: string; api_key: string; created_at: string }>),
  getMe: () => client.get("/users/me").then(raw<UserAccount>),

  // Profile
  getProfile: () => client.get("/profile").then(raw<UserProfile>),
  updateProfile: (body: Partial<Omit<UserProfile, "user_id" | "updated_at">>) =>
    client.put("/profile", body).then(raw<UserProfile>),

  listWorkHistory: () => client.get("/profile/work-history").then(raw<WorkHistoryEntry[]>),
  createWorkHistory: (body: Omit<WorkHistoryEntry, "id">) =>
    client.post("/profile/work-history", body).then(raw<WorkHistoryEntry>),
  updateWorkHistory: (id: string, body: Partial<Omit<WorkHistoryEntry, "id">>) =>
    client.put(`/profile/work-history/${id}`, body).then(raw<WorkHistoryEntry>),
  deleteWorkHistory: (id: string) => client.delete(`/profile/work-history/${id}`),

  listEducation: () => client.get("/profile/education").then(raw<EducationEntry[]>),
  createEducation: (body: Omit<EducationEntry, "id">) =>
    client.post("/profile/education", body).then(raw<EducationEntry>),
  updateEducation: (id: string, body: Partial<Omit<EducationEntry, "id">>) =>
    client.put(`/profile/education/${id}`, body).then(raw<EducationEntry>),
  deleteEducation: (id: string) => client.delete(`/profile/education/${id}`),

  listSkills: () => client.get("/profile/skills").then(raw<SkillEntry[]>),
  createSkill: (body: Omit<SkillEntry, "id">) => client.post("/profile/skills", body).then(raw<SkillEntry>),
  updateSkill: (id: string, body: Partial<Omit<SkillEntry, "id">>) =>
    client.put(`/profile/skills/${id}`, body).then(raw<SkillEntry>),
  deleteSkill: (id: string) => client.delete(`/profile/skills/${id}`),

  // Resume
  ingestResume: (formData: FormData) =>
    client.post("/resume/ingest", formData).then(unwrap<{ status: string; chunks_ingested: number }>),

  // Jobs
  ingestJob: (body: { job_text: string; title: string; company?: string; location?: string; source_url?: string }) =>
    client.post("/jobs/ingest", body).then(unwrap<JobIngestionResult>),
  matchJob: (body: { job_text: string; job_title: string }) => client.post("/jobs/match", body).then(unwrap<unknown>),

  // Applications
  generateApplication: (body: {
    job_description: string;
    job_title: string;
    application_type: ApplicationType;
    job_posting_id?: string;
  }) =>
    client
      .post("/applications/generate", body)
      .then(unwrap<{ content: string; match_score: number; sources_used: number }>),
  runWorkflow: (body: { job_description: string; job_title: string; job_posting_id?: string }) =>
    client
      .post("/applications/workflow", body)
      .then(unwrap<{ id: string; application: string; critique: string; final_output: Record<string, unknown> }>),
  listApplications: (page = 0, size = 10) =>
    client.get(`/applications?page=${page}&size=${size}`).then(unwrap<ApplicationListResult>),
  getApplication: (id: string) => client.get(`/applications/${id}`).then(unwrap<ApplicationDetail>),
};
