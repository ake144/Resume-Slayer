export type ApplicationType =
  | "cover_letter"
  | "resume_tailoring"
  | "interview_prep"
  | "linkedin_message"
  | "upwork_proposal"
  | "cold_pitch";

export type ApplicationStatus =
  | "draft"
  | "generated"
  | "submitted"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface JobMatchAnalysis {
  match_score: number;
  strong_matches: string[];
  skill_gaps: string[];
  tailoring_recommendations: string[];
  overall_verdict: string;
  confidence_level: string;
}

export interface Application {
  id: string;
  job_title: string;
  company: string | null;
  application_type: ApplicationType;
  status: ApplicationStatus;
  match_score: number | null;
  job_posting_id: string | null;
  created_at: string;
}

export interface ApplicationDetail extends Application {
  generated_content: string;
  sources_used: number | null;
  match_analysis: JobMatchAnalysis | null;
  submitted_at: string | null;
}

export interface ApplicationListResult {
  content: Application[];
  totalItems: number;
  totalPages: number;
}

export interface UserAccount {
  id: string;
  email: string;
  created_at: string;
}

export interface UserProfile {
  user_id: string;
  full_name: string | null;
  contact_email: string | null;
  phone: string | null;
  location: string | null;
  links: Record<string, string> | null;
  summary: string | null;
  updated_at: string;
}

export interface WorkHistoryEntry {
  id: string;
  company: string;
  job_title: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string | null;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  gpa: string | null;
  description: string | null;
}

export interface SkillEntry {
  id: string;
  name: string;
  category: string | null;
  proficiency: string | null;
}
