package com.example.jobboard.repository;

import com.example.jobboard.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    List<Job> findByTitleContainingIgnoreCase(String title);
    
    List<Job> findByCompanyContainingIgnoreCase(String company);
    
    List<Job> findByLocationContainingIgnoreCase(String location);
} 