export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  salary: number;
  contactEmail?: string;
  postedDate: string;
} 