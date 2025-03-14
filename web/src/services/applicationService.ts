import { API_BASE_URL } from '../config';

/**
 * Apply for a job
 * @param jobId The ID of the job to apply for
 */
export const applyForJob = async (jobId: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        jobId: Number(jobId)
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to apply for job');
    }
    
    return { success: true, message: 'Application submitted successfully!' };
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

/**
 * Check if the current user has already applied for a job
 * @param jobId The ID of the job to check
 */
export const hasUserAppliedForJob = async (jobId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/check?jobId=${Number(jobId)}`);
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return Boolean(data);
  } catch (error) {
    console.error('Error checking application status:', error);
    return false;
  }
};

/**
 * Get all applications for the current user
 */
export const getUserApplications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/user`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}; 