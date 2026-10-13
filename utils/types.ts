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

export interface CareerSummary {
  display_name: string | null;
  profile_readiness: {
    score: number;
    identity: boolean;
    summary: boolean;
    skills: boolean;
    work_history: boolean;
    verified_evidence: boolean;
  };
  skill_gaps: string[];
  active_applications: number;
  average_match_score: number | null;
  recent_applications: Application[];
  next_actions: Array<{
    title: string;
    description: string;
    href: string;
    priority: "urgent" | "ready" | "build";
  }>;
}

export interface ResumeVersion {
  id: string;
  title: string;
  filename: string | null;
  content_type: string | null;
  extracted_text: string;
  content_hash: string;
  parser_status: string;
  created_at: string;
}

export interface CareerEvidence {
  id: string;
  evidence_type: string;
  title: string;
  description: string;
  source: string;
  source_resume_version_id: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CareerPreferences {
  user_id: string;
  work_modes: string[] | null;
  employment_types: string[] | null;
  preferred_locations: string[] | null;
  minimum_salary: number | null;
  salary_currency: string | null;
  willing_to_relocate: boolean | null;
  visa_sponsorship_required: boolean | null;
  updated_at: string;
}

export interface TargetRole {
  id: string;
  role_name: string;
  priority: number;
  created_at: string;
  updated_at: string;
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
