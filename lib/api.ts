import axios, { AxiosResponse } from "axios";
import { getApiKey } from "@/utils/common";
import type {
  ApplicationDetail,
  ApplicationArtifact,
  ApplicationEvent,
  ApplicationTask,
  ApplicationContact,
  InterviewSession,
  InterviewAnswer,
  ApplicationListResult,
  ApplicationType,
  CareerEvidence,
  CareerPreferences,
  MatchResult,
  JobPosting,
  JobSource,
  CareerSummary,
  EducationEntry,
  ResumeVersion,
  SkillEntry,
  UserAccount,
  UserProfile,
  TargetRole,
  WorkHistoryEntry,
} from "@/utils/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const client = axios.create({ baseURL: `${API_BASE_URL}/api/v1`, withCredentials: true });

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
  requestMagicLink: (email: string) => client.post("/users/magic-link", null, { params: { email } }),
  verifyMagicLink: (token: string) => client.post("/users/magic-link/verify", null, { params: { token } }),

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
  listEvidence: () => client.get("/profile/evidence").then(raw<CareerEvidence[]>),
  createEvidence: (body: Omit<CareerEvidence, "id" | "created_at" | "updated_at">) =>
    client.post("/profile/evidence", body).then(raw<CareerEvidence>),
  updateEvidence: (id: string, body: Partial<Omit<CareerEvidence, "id" | "created_at" | "updated_at">>) =>
    client.put(`/profile/evidence/${id}`, body).then(raw<CareerEvidence>),
  deleteEvidence: (id: string) => client.delete(`/profile/evidence/${id}`),
  getCareerPreferences: () => client.get("/profile/preferences").then(raw<CareerPreferences>),
  updateCareerPreferences: (body: Partial<Omit<CareerPreferences, "user_id" | "updated_at">>) =>
    client.put("/profile/preferences", body).then(raw<CareerPreferences>),
  listTargetRoles: () => client.get("/profile/target-roles").then(raw<TargetRole[]>),
  createTargetRole: (body: { role_name: string; priority?: number }) =>
    client.post("/profile/target-roles", body).then(raw<TargetRole>),
  deleteTargetRole: (id: string) => client.delete(`/profile/target-roles/${id}`),

  // Resume
  ingestResume: (formData: FormData) =>
    client.post("/resume/ingest", formData).then(unwrap<{ status: string; chunks_ingested: number }>),
  
  listResumeVersions: () => client.get("/resume/versions").then(raw<ResumeVersion[]>),
  downloadResumeVersion: (id: string) =>
    client.get(`/resume/versions/${id}/file`, { responseType: "blob" }).then((response) => response.data as Blob),

  // Jobs
  ingestJob: (body: { job_text: string; title: string; company?: string; location?: string; source_url?: string; source_type?: string; source_id?: string }) =>
    client.post("/jobs/ingest", body).then(unwrap<JobIngestionResult>),
  listLocalSources: () => client.get("/jobs/local-sources").then(raw<Array<{
    provider: string;
    label: string;
    region: string;
    homepage: string;
    mode: string;
    notes: string;
  }>>),
  matchJob: (body: { job_text: string; job_title: string; job_posting_id?: string }) =>
    client.post("/jobs/match", body).then(unwrap<MatchResult>),
  listMatches: (jobPostingId?: string) =>
    client.get("/jobs/matches", { params: jobPostingId ? { job_posting_id: jobPostingId } : undefined }).then(unwrap<MatchResult[]>),
  getMatch: (id: string) => client.get(`/jobs/matches/${id}`).then(unwrap<MatchResult>),
  listJobPostings: (includeExpired = false) =>
    client.get(`/jobs/postings?include_expired=${includeExpired}`).then(unwrap<JobPosting[]>),
  listJobSources: () => client.get("/jobs/sources").then(unwrap<JobSource[]>),
  createJobSource: (body: { provider: string; source_key: string; enabled?: boolean; config?: Record<string, unknown> }) =>
    client.post("/jobs/sources", body).then(unwrap<JobSource>),
  discoverJobSource: (id: string) =>
    client.post(`/jobs/sources/${id}/discover`).then(unwrap<{ source_id: string; provider: string; jobs_seen: number; created: number; updated: number; posting_ids: string[] }>),
  rankJobPostings: (body: { posting_ids?: string[]; source_id?: string; limit?: number; refresh?: boolean } = {}) =>
    client.post("/jobs/postings/rank", body).then(unwrap<{ evaluated: number; skipped: number; failed: number; match_ids: string[] }>),

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
  listApplications: (page = 0, size = 10, status_filter?: import("@/utils/types").ApplicationStatus, sort = "newest") =>
    client.get("/applications", { params: { page, size, status_filter, sort } }).then(unwrap<ApplicationListResult>),
  getApplication: (id: string) => client.get(`/applications/${id}`).then(unwrap<ApplicationDetail>),
  listApplicationArtifacts: (applicationId: string) => client.get(`/applications/${applicationId}/artifacts`).then(unwrap<ApplicationArtifact[]>),
  approveArtifact: (id: string, review_notes?: string) => client.post(`/applications/artifacts/${id}/approve`, { review_notes }).then(unwrap<ApplicationArtifact>),
  rejectArtifact: (id: string, review_notes?: string) => client.post(`/applications/artifacts/${id}/reject`, { review_notes }).then(unwrap<ApplicationArtifact>),
  reviseArtifact: (id: string, content: string, review_notes?: string) => client.post(`/applications/artifacts/${id}/revisions`, { content, review_notes }).then(unwrap<ApplicationArtifact>),
  updateApplicationStatus: (id: string, status: import("@/utils/types").ApplicationStatus, note?: string) => client.post(`/applications/${id}/status`, { status, note }).then(unwrap<ApplicationDetail>),
  listApplicationEvents: (id: string) => client.get(`/applications/${id}/events`).then(unwrap<ApplicationEvent[]>),
  listApplicationTasks: (id: string) => client.get(`/applications/${id}/tasks`).then(unwrap<ApplicationTask[]>),
  createApplicationTask: (id: string, body: { title: string; note?: string; due_at?: string }) => client.post(`/applications/${id}/tasks`, body).then(unwrap<ApplicationTask>),
  completeApplicationTask: (id: string) => client.post(`/applications/tasks/${id}/complete`).then(unwrap<ApplicationTask>),
  listApplicationContacts: (id: string) => client.get(`/applications/${id}/contacts`).then(unwrap<ApplicationContact[]>),
  createApplicationContact: (id: string, body: { name: string; email?: string; role?: string; notes?: string }) => client.post(`/applications/${id}/contacts`, body).then(unwrap<ApplicationContact>),
  createInterviewSession: (body: { application_id: string; stage?: string; scheduled_at?: string; question_set?: string[] }) => client.post("/interviews/sessions", body).then(unwrap<InterviewSession>),
  listInterviewSessions: (application_id?: string) => client.get("/interviews/sessions", { params: application_id ? { application_id } : undefined }).then(unwrap<InterviewSession[]>),
  saveInterviewAnswer: (sessionId: string, body: { question_index: number; answer: string }) => client.post(`/interviews/sessions/${sessionId}/answers`, body).then(unwrap<InterviewAnswer>),
  listInterviewAnswers: (sessionId: string) => client.get(`/interviews/sessions/${sessionId}/answers`).then(unwrap<InterviewAnswer[]>),
  deleteInterviewSession: (sessionId: string) => client.delete(`/interviews/sessions/${sessionId}`),

  // Career agent
  getCareerSummary: () => client.get("/career/summary").then(raw<CareerSummary>),
  submitFeedback: (body: { subject_type: "match" | "artifact" | "recommendation"; subject_id: string; feedback_type: "useful" | "not_useful" | "correction" | "quality"; rating?: number; comment?: string }) => client.post("/career/feedback", body),
};
