export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  salary?: number;
  minSalary?: number;
  maxSalary?: number;
  contactEmail?: string;
  postedDate?: string;
  createdAt: string;
} 