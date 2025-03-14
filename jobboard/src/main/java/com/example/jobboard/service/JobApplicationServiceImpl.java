package com.example.jobboard.service;

import com.example.jobboard.dto.JobApplicationRequest;
import com.example.jobboard.dto.JobApplicationResponse;
import com.example.jobboard.model.Job;
import com.example.jobboard.model.JobApplication;
import com.example.jobboard.model.User;
import com.example.jobboard.repository.JobApplicationRepository;
import com.example.jobboard.repository.JobRepository;
import com.example.jobboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Autowired
    public JobApplicationServiceImpl(JobApplicationRepository jobApplicationRepository,
                                    JobRepository jobRepository,
                                    UserRepository userRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @Override
    public JobApplicationResponse applyForJob(Long userId, JobApplicationRequest request) {
        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        // Check if job exists
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new NoSuchElementException("Job not found"));

        // Check if user has already applied
        if (jobApplicationRepository.existsByUserIdAndJobId(userId, request.getJobId())) {
            return new JobApplicationResponse("You have already applied for this job");
        }

        // Create and save the application
        JobApplication application = new JobApplication(user, job, request.getCoverLetter());
        JobApplication savedApplication = jobApplicationRepository.save(application);

        // Return response
        return new JobApplicationResponse(
                savedApplication.getId(),
                userId,
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                savedApplication.getAppliedAt(),
                savedApplication.getStatus()
        );
    }

    @Override
    public List<JobApplication> getUserApplications(Long userId) {
        // Check if user exists
        if (!userRepository.existsById(userId)) {
            throw new NoSuchElementException("User not found");
        }
        
        return jobApplicationRepository.findByUserId(userId);
    }

    @Override
    public boolean hasUserAppliedForJob(Long userId, Long jobId) {
        return jobApplicationRepository.existsByUserIdAndJobId(userId, jobId);
    }

    @Override
    public List<JobApplication> getJobApplications(Long jobId) {
        // Check if job exists
        if (!jobRepository.existsById(jobId)) {
            throw new NoSuchElementException("Job not found");
        }
        
        return jobApplicationRepository.findByJobId(jobId);
    }

    @Override
    public JobApplication getApplication(Long applicationId) {
        return jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new NoSuchElementException("Application not found"));
    }

    @Override
    public JobApplication updateApplicationStatus(Long applicationId, String status) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new NoSuchElementException("Application not found"));
        
        application.setStatus(status);
        return jobApplicationRepository.save(application);
    }
} 