package com.example.jobboard.service;

import com.example.jobboard.model.Job;

import java.util.List;
import java.util.Optional;

public interface JobService {
    
    List<Job> getAllJobs();
    
    Optional<Job> getJobById(Long id);
    
    Job saveJob(Job job);
    
    void deleteJob(Long id);
    
    List<Job> searchJobsByTitle(String title);
    
    List<Job> searchJobsByCompany(String company);
    
    List<Job> searchJobsByLocation(String location);
} 