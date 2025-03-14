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
  
  const data = await response.json();
  
  // Handle both response formats:
  // 1. Array of jobs directly
  // 2. Object with jobs property
  if (Array.isArray(data)) {
    return {
      jobs: data,
      totalPages: 1 // Default if pagination info is not provided
    };
  } else if (data && data.jobs) {
    return data;
  } else {
    console.error('Unexpected response format:', data);
    return {
      jobs: [],
      totalPages: 0
    };
  }
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

/**
 * Create a new job
 * 
 * @param jobData Job data to create
 * @returns Response with success status and message
 */
export const createJob = async (jobData: any): Promise<{ success: boolean, message?: string, job?: Job }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(jobData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error: ${response.status} ${response.statusText}`
      };
    }
    
    return {
      success: true,
      job: data
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}; 