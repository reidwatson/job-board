package com.example.jobboard.service;

import com.example.jobboard.dto.JobApplicationRequest;
import com.example.jobboard.dto.JobApplicationResponse;
import com.example.jobboard.model.JobApplication;

import java.util.List;

public interface JobApplicationService {
    
    /**
     * Apply for a job
     * 
     * @param userId the user ID
     * @param request the application request
     * @return the application response
     */
    JobApplicationResponse applyForJob(Long userId, JobApplicationRequest request);
    
    /**
     * Get all applications for a user
     * 
     * @param userId the user ID
     * @return list of job applications
     */
    List<JobApplication> getUserApplications(Long userId);
    
    /**
     * Check if a user has already applied for a job
     * 
     * @param userId the user ID
     * @param jobId the job ID
     * @return true if the user has already applied
     */
    boolean hasUserAppliedForJob(Long userId, Long jobId);
    
    /**
     * Get all applications for a job
     * 
     * @param jobId the job ID
     * @return list of job applications
     */
    List<JobApplication> getJobApplications(Long jobId);
    
    /**
     * Get a specific application
     * 
     * @param applicationId the application ID
     * @return the job application if found
     */
    JobApplication getApplication(Long applicationId);
    
    /**
     * Update application status
     * 
     * @param applicationId the application ID
     * @param status the new status
     * @return the updated application
     */
    JobApplication updateApplicationStatus(Long applicationId, String status);
} 