package com.example.jobboard.service;

import com.example.jobboard.model.Job;
import com.example.jobboard.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class JobServiceImplTest {

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private JobServiceImpl jobService;

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
        when(jobRepository.findAll()).thenReturn(jobs);

        // Act
        List<Job> result = jobService.getAllJobs();

        // Assert
        assertEquals(1, result.size());
        assertEquals("Software Engineer", result.get(0).getTitle());
        verify(jobRepository, times(1)).findAll();
    }

    @Test
    public void testGetJobById() {
        // Arrange
        when(jobRepository.findById(1L)).thenReturn(Optional.of(testJob));

        // Act
        Optional<Job> result = jobService.getJobById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Software Engineer", result.get().getTitle());
        verify(jobRepository, times(1)).findById(1L);
    }

    @Test
    public void testSaveJob() {
        // Arrange
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        // Act
        Job result = jobService.saveJob(testJob);

        // Assert
        assertEquals("Software Engineer", result.getTitle());
        verify(jobRepository, times(1)).save(testJob);
    }

    @Test
    public void testDeleteJob() {
        // Arrange
        doNothing().when(jobRepository).deleteById(1L);

        // Act
        jobService.deleteJob(1L);

        // Assert
        verify(jobRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testSearchJobsByTitle() {
        // Arrange
        List<Job> jobs = Arrays.asList(testJob);
        when(jobRepository.findByTitleContainingIgnoreCase("Software")).thenReturn(jobs);

        // Act
        List<Job> result = jobService.searchJobsByTitle("Software");

        // Assert
        assertEquals(1, result.size());
        assertEquals("Software Engineer", result.get(0).getTitle());
        verify(jobRepository, times(1)).findByTitleContainingIgnoreCase("Software");
    }

    @Test
    public void testSearchJobsByCompany() {
        // Arrange
        List<Job> jobs = Arrays.asList(testJob);
        when(jobRepository.findByCompanyContainingIgnoreCase("Tech")).thenReturn(jobs);

        // Act
        List<Job> result = jobService.searchJobsByCompany("Tech");

        // Assert
        assertEquals(1, result.size());
        assertEquals("Tech Corp", result.get(0).getCompany());
        verify(jobRepository, times(1)).findByCompanyContainingIgnoreCase("Tech");
    }

    @Test
    public void testSearchJobsByLocation() {
        // Arrange
        List<Job> jobs = Arrays.asList(testJob);
        when(jobRepository.findByLocationContainingIgnoreCase("San Francisco")).thenReturn(jobs);

        // Act
        List<Job> result = jobService.searchJobsByLocation("San Francisco");

        // Assert
        assertEquals(1, result.size());
        assertEquals("San Francisco, CA", result.get(0).getLocation());
        verify(jobRepository, times(1)).findByLocationContainingIgnoreCase("San Francisco");
    }
} 