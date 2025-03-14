package com.example.jobboard.controller;

import com.example.jobboard.model.Job;
import com.example.jobboard.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Debug endpoint to see what's being received
    @PostMapping("/debug")
    public ResponseEntity<Map<String, Object>> debugCreateJob(@RequestBody Map<String, Object> jobData) {
        System.out.println("Received job data: " + jobData);
        return ResponseEntity.ok(jobData);
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@Valid @RequestBody Job job) {
        System.out.println("Received job: " + job);
        Job savedJob = jobService.saveJob(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @Valid @RequestBody Job job) {
        return jobService.getJobById(id)
                .map(existingJob -> {
                    job.setId(id);
                    return ResponseEntity.ok(jobService.saveJob(job));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(job -> {
                    jobService.deleteJob(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/title")
    public ResponseEntity<List<Job>> searchJobsByTitle(@RequestParam String title) {
        return ResponseEntity.ok(jobService.searchJobsByTitle(title));
    }

    @GetMapping("/search/company")
    public ResponseEntity<List<Job>> searchJobsByCompany(@RequestParam String company) {
        return ResponseEntity.ok(jobService.searchJobsByCompany(company));
    }

    @GetMapping("/search/location")
    public ResponseEntity<List<Job>> searchJobsByLocation(@RequestParam String location) {
        return ResponseEntity.ok(jobService.searchJobsByLocation(location));
    }
}