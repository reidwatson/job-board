package com.example.jobboard.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;

    @Column(name = "status", nullable = false)
    private String status; // "PENDING", "REVIEWED", "REJECTED", "ACCEPTED"

    @Column(name = "cover_letter")
    private String coverLetter;

    // Default constructor
    public JobApplication() {
        this.appliedAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Constructor with fields
    public JobApplication(User user, Job job) {
        this.user = user;
        this.job = job;
        this.appliedAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Constructor with all fields
    public JobApplication(User user, Job job, String coverLetter) {
        this.user = user;
        this.job = job;
        this.coverLetter = coverLetter;
        this.appliedAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
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

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    @Override
    public String toString() {
        return "JobApplication{" +
                "id=" + id +
                ", userId=" + (user != null ? user.getId() : null) +
                ", jobId=" + (job != null ? job.getId() : null) +
                ", appliedAt=" + appliedAt +
                ", status='" + status + '\'' +
                '}';
    }
} 