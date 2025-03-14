export interface JobApplication {
  id: number;
  userId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  appliedAt: string;
  status: string;
}

export interface JobApplicationRequest {
  jobId: number;
  coverLetter?: string;
}

export interface JobApplicationResponse {
  id?: number;
  userId?: number;
  jobId?: number;
  jobTitle?: string;
  companyName?: string;
  appliedAt?: string;
  status?: string;
  success: boolean;
  message: string;
} 