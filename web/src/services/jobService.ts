import { Job } from '../types/Job';
import { API_BASE_URL } from '../config';

/**
 * Get a list of jobs with pagination and search
 * 
 * @param page Page number (1-indexed)
 * @param size Number of items per page
 * @param search Search query
 * @returns Jobs and pagination info
 */
export const getJobs = async (page = 1, size = 10, search = ''): Promise<{ jobs: Job[], totalPages: number }> => {
  const response = await fetch(`${API_BASE_URL}/api/jobs?page=${page}&size=${size}&search=${encodeURIComponent(search)}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  return await response.json();
};

/**
 * Get a job by ID
 * 
 * @param id Job ID
 * @returns Job details
 */
export const getJobById = async (id: number): Promise<Job> => {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch job details');
  }
  
  return await response.json();
}; 