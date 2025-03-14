package com.example.jobboard.controller;

import com.example.jobboard.dto.JobApplicationRequest;
import com.example.jobboard.dto.JobApplicationResponse;
import com.example.jobboard.model.JobApplication;
import com.example.jobboard.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @Autowired
    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @PostMapping
    public ResponseEntity<JobApplicationResponse> applyForJob(
            @Valid @RequestBody JobApplicationRequest request) {
        try {
            // Use a fixed user ID for demo purposes
            Long userId = 1L;
            
            JobApplicationResponse response = jobApplicationService.applyForJob(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new JobApplicationResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> hasUserAppliedForJob(@RequestParam Long jobId) {
        try {
            // Use a fixed user ID for demo purposes
            Long userId = 1L;
            
            boolean hasApplied = jobApplicationService.hasUserAppliedForJob(userId, jobId);
            return ResponseEntity.ok(hasApplied);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<JobApplication>> getUserApplications() {
        try {
            // Use a fixed user ID for demo purposes
            Long userId = 1L;
            
            List<JobApplication> applications = jobApplicationService.getUserApplications(userId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
} 