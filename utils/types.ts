export interface SlayType {
    id: number;
    jobTitle: string;
    atsScore: string;
    company: string;
    createdAt: string;
    optimizedResume: string;
    originalResume: string;
    jobUrl: string;
    trapsFixed?: string | string[];
    missingSkills?: string | string[];
    roadmap?: any;
    roadMap?: any; // Just in case from Spring Boot
}
