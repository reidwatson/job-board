package com.example.jobboard.controller;

import com.example.jobboard.dto.JobApplicationRequest;
import com.example.jobboard.dto.JobApplicationResponse;
import com.example.jobboard.model.JobApplication;
import com.example.jobboard.service.JobApplicationService;
import com.example.jobboard.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Base64;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private static final Logger logger = Logger.getLogger(JobApplicationController.class.getName());
    
    private final JobApplicationService jobApplicationService;
    private final AuthService authService;

    @Autowired
    public JobApplicationController(JobApplicationService jobApplicationService, AuthService authService) {
        this.jobApplicationService = jobApplicationService;
        this.authService = authService;
    }
    
    /**
     * Extract user ID from the Authorization header
     * @param authHeader The Authorization header value
     * @return The user ID or null if not found
     */
    private Long extractUserIdFromToken(String authHeader) {
        logger.info("Extracting user ID from auth header: " + (authHeader != null ? "present" : "null"));
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warning("Auth header is null or doesn't start with 'Bearer '");
            return null;
        }
        
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        logger.info("Token extracted: " + token);
        
        // Validate token
        boolean isValid = authService.validateToken(token);
        logger.info("Token validation result: " + isValid);
        
        if (!isValid) {
            logger.warning("Token validation failed");
            return null;
        }
        
        // In a real application, you would extract the user ID from the token
        // For now, we'll decode the Base64 token and extract the user ID
        try {
            String decodedToken = new String(Base64.getDecoder().decode(token));
            logger.info("Decoded token: " + decodedToken);
            
            String userId = decodedToken.split(":")[0];
            logger.info("Extracted user ID: " + userId);
            
            return Long.parseLong(userId);
        } catch (Exception e) {
            logger.severe("Error extracting user ID from token: " + e.getMessage());
            return null;
        }
    }

    @PostMapping
    public ResponseEntity<JobApplicationResponse> applyForJob(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @Valid @RequestBody JobApplicationRequest request) {
        try {
            // Extract user ID from token
            Long userId = extractUserIdFromToken(authHeader);
            logger.info("User ID extracted for job application: " + userId);
            
            if (userId == null) {
                logger.warning("Authentication required for job application");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new JobApplicationResponse("Authentication required"));
            }
            
            JobApplicationResponse response = jobApplicationService.applyForJob(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.severe("Error applying for job: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new JobApplicationResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> hasUserAppliedForJob(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam Long jobId) {
        try {
            // Extract user ID from token
            Long userId = extractUserIdFromToken(authHeader);
            logger.info("User ID extracted for application check: " + userId);
            
            if (userId == null) {
                logger.warning("Authentication required for application check");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
            }
            
            boolean hasApplied = jobApplicationService.hasUserAppliedForJob(userId, jobId);
            return ResponseEntity.ok(hasApplied);
        } catch (Exception e) {
            logger.severe("Error checking application status: " + e.getMessage());
            return ResponseEntity.ok(false);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<JobApplication>> getUserApplications(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Extract user ID from token
            Long userId = extractUserIdFromToken(authHeader);
            logger.info("User ID extracted for getting applications: " + userId);
            
            if (userId == null) {
                logger.warning("Authentication required for getting user applications");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            
            List<JobApplication> applications = jobApplicationService.getUserApplications(userId);
            logger.info("Found " + applications.size() + " applications for user " + userId);
            
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            logger.severe("Error getting user applications: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
} 