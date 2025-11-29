export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: 'job_seeker' | 'recruiter';
    createdAt: string;
    updatedAt: string;
}

export interface IJob {
    _id: string;
    recruiter: string;
    title: string;
    description: string;
    company: string;
    skills: string[];
    locations: string;
    jobType: string;
    minSalary: number;
    maxSalary: number;
    lastDateToApply: string;
    experienceRequired: string;
    status: 'open' | 'closed';
    createdAt: string;
    updatedAt: string;
}

export interface IApplication {
    _id: string;
    job: string | IJob;
    applicant: string | IUser;
    recruiter: string | IUser;
    status: string;
    coverLetter?: string;
    resume: string;
    createdAt: string;
    updatedAt: string;
}