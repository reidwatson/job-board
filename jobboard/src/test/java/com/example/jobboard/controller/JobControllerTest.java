package com.example.jobboard.controller;

import com.example.jobboard.model.Job;
import com.example.jobboard.service.JobService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

public class JobControllerTest {

    @Mock
    private JobService jobService;

    @InjectMocks
    private JobController jobController;

    private Job testJob;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        
        testJob = new Job();
        testJob.setId(1L);
        testJob.setTitle("Software Engineer");
        testJob.setCompany("Tech Corp");
        testJob.setLocation("San Francisco, CA");
        testJob.setDescription("Developing web applications");
        testJob.setRequirements("Java, Spring Boot, MySQL");
        testJob.setSalary(120000.0);
        testJob.setContactEmail("jobs@techcorp.com");
        testJob.setPostedDate(LocalDateTime.now());
    }

    @Test
    public void testGetAllJobs() {
        // Arrange
        List<Job> jobs = Arrays.asList(testJob);
        when(jobService.getAllJobs()).thenReturn(jobs);

        // Act
        ResponseEntity<List<Job>> response = jobController.getAllJobs();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Software Engineer", response.getBody().get(0).getTitle());
    }

    @Test
    public void testGetJobById_Found() {
        // Arrange
        when(jobService.getJobById(1L)).thenReturn(Optional.of(testJob));

        // Act
        ResponseEntity<Job> response = jobController.getJobById(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Software Engineer", response.getBody().getTitle());
    }

    @Test
    public void testGetJobById_NotFound() {
        // Arrange
        when(jobService.getJobById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Job> response = jobController.getJobById(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testCreateJob() {
        // Arrange
        when(jobService.saveJob(any(Job.class))).thenReturn(testJob);

        // Act
        ResponseEntity<Job> response = jobController.createJob(testJob);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Software Engineer", response.getBody().getTitle());
        verify(jobService, times(1)).saveJob(any(Job.class));
    }

    @Test
    public void testUpdateJob_Found() {
        // Arrange
        Job updatedJob = new Job();
        updatedJob.setTitle("Senior Software Engineer");
        updatedJob.setCompany("Tech Corp");
        updatedJob.setLocation("San Francisco, CA");
        updatedJob.setDescription("Leading development of web applications");
        updatedJob.setSalary(150000.0);
        
        when(jobService.getJobById(1L)).thenReturn(Optional.of(testJob));
        when(jobService.saveJob(any(Job.class))).thenReturn(updatedJob);

        // Act
        ResponseEntity<Job> response = jobController.updateJob(1L, updatedJob);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Senior Software Engineer", response.getBody().getTitle());
        verify(jobService, times(1)).saveJob(any(Job.class));
    }

    @Test
    public void testUpdateJob_NotFound() {
        // Arrange
        when(jobService.getJobById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Job> response = jobController.updateJob(999L, testJob);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(jobService, never()).saveJob(any(Job.class));
    }

    @Test
    public void testDeleteJob_Found() {
        // Arrange
        when(jobService.getJobById(1L)).thenReturn(Optional.of(testJob));
        doNothing().when(jobService).deleteJob(1L);

        // Act
        ResponseEntity<Void> response = jobController.deleteJob(1L);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(jobService, times(1)).deleteJob(1L);
    }

    @Test
    public void testDeleteJob_NotFound() {
        // Arrange
        when(jobService.getJobById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Void> response = jobController.deleteJob(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(jobService, never()).deleteJob(anyLong());
    }

    @Test
    public void testSearchJobsByTitle() {
        // Arrange
        List<Job> jobs = Arrays.asList(testJob);
        when(jobService.searchJobsByTitle("Software")).thenReturn(jobs);

        // Act
        ResponseEntity<List<Job>> response = jobController.searchJobsByTitle("Software");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Software Engineer", response.getBody().get(0).getTitle());
    }
} 