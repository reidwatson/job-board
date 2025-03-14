import { API_BASE_URL } from '../config';

/**
 * Apply for a job
 * @param jobId The ID of the job to apply for
 */
export const applyForJob = async (jobId: number): Promise<{ success: boolean; message?: string }> => {
  try {
    // Get the user object from localStorage
    const userJson = localStorage.getItem('user');
    
    if (!userJson) {
      throw new Error('Authentication required');
    }
    
    // Parse the user object and get the token
    const user = JSON.parse(userJson);
    const token = user.token;
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        jobId: Number(jobId)
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from server:', errorData);
      throw new Error(errorData.message || 'Failed to apply for job');
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
    // Get the user object from localStorage
    const userJson = localStorage.getItem('user');
    
    if (!userJson) {
      return false;
    }
    
    // Parse the user object and get the token
    const user = JSON.parse(userJson);
    const token = user.token;
    
    if (!token) {
      return false;
    }
    
    console.log('Using token for check:', token);
    
    const response = await fetch(`${API_BASE_URL}/api/applications/check?jobId=${Number(jobId)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      console.error('Error response from server (check):', response.status, response.statusText);
      return false;
    }
    
    const data = await response.json();
    console.log('Application check result:', data);
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
    // Get the user object from localStorage
    const userJson = localStorage.getItem('user');
    console.log('User JSON from localStorage (applications):', userJson);
    
    if (!userJson) {
      throw new Error('Authentication required');
    }
    
    // Parse the user object and get the token
    const user = JSON.parse(userJson);
    const token = user.token;
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    console.log('Using token for applications:', token);
    
    const response = await fetch(`${API_BASE_URL}/api/applications/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      console.error('Error response from server (applications):', response.status, response.statusText);
      throw new Error('Failed to fetch applications');
    }
    
    const data = await response.json();
    console.log('Applications data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}; 