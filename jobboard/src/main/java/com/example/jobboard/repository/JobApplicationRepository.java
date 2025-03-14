package com.example.jobboard.repository;

import com.example.jobboard.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    
    /**
     * Find all applications for a specific user
     * 
     * @param userId the user ID
     * @return list of job applications
     */
    List<JobApplication> findByUserId(Long userId);
    
    /**
     * Find all applications for a specific job
     * 
     * @param jobId the job ID
     * @return list of job applications
     */
    List<JobApplication> findByJobId(Long jobId);
    
    /**
     * Find a specific application by user and job
     * 
     * @param userId the user ID
     * @param jobId the job ID
     * @return the job application if found
     */
    Optional<JobApplication> findByUserIdAndJobId(Long userId, Long jobId);
    
    /**
     * Check if a user has already applied for a job
     * 
     * @param userId the user ID
     * @param jobId the job ID
     * @return true if the user has already applied
     */
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
} 