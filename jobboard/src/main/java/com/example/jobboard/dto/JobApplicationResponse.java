package com.example.jobboard.dto;

import java.time.LocalDateTime;

public class JobApplicationResponse {

    private Long id;
    private Long userId;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private LocalDateTime appliedAt;
    private String status;
    private boolean success;
    private String message;

    // Default constructor
    public JobApplicationResponse() {
    }

    // Constructor for successful application
    public JobApplicationResponse(Long id, Long userId, Long jobId, String jobTitle, String companyName, 
                                 LocalDateTime appliedAt, String status) {
        this.id = id;
        this.userId = userId;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.appliedAt = appliedAt;
        this.status = status;
        this.success = true;
        this.message = "Application submitted successfully";
    }

    // Constructor for failed application
    public JobApplicationResponse(String message) {
        this.success = false;
        this.message = message;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
} 