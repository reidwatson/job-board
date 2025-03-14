package com.example.jobboard.dto;

import jakarta.validation.constraints.NotNull;

public class JobApplicationRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;
    
    private String coverLetter;

    // Getters and setters
    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }
} 