declare module '../services/jobService' {
  import { Job } from '../types/Job';
  
  export function getJobs(page?: number, size?: number, search?: string): Promise<{ jobs: Job[], totalPages: number }>;
  export function getJobById(id: number): Promise<Job>;
} 