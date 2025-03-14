package com.example.jobboard.integration;

import com.example.jobboard.JobBoardApplication;
import com.example.jobboard.model.Job;
import com.example.jobboard.repository.JobRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = JobBoardApplication.class)
@AutoConfigureMockMvc
public class JobControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Job testJob;

    @BeforeEach
    public void setup() {
        testJob = new Job();
        testJob.setTitle("Software Engineer");
        testJob.setCompany("Tech Corp");
        testJob.setLocation("San Francisco, CA");
        testJob.setDescription("Developing web applications");
        testJob.setRequirements("Java, Spring Boot, MySQL");
        testJob.setSalary(120000.0);
        testJob.setContactEmail("jobs@techcorp.com");
        testJob.setPostedDate(LocalDateTime.now());
        
        // Save the test job to the database
        jobRepository.save(testJob);
    }

    @AfterEach
    public void cleanup() {
        // Clean up the database after each test
        jobRepository.deleteAll();
    }

    @Test
    public void testGetAllJobs() throws Exception {
        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].title", is("Software Engineer")))
                .andExpect(jsonPath("$[0].company", is("Tech Corp")));
    }

    @Test
    public void testGetJobById() throws Exception {
        // Get the ID of the saved job
        Long jobId = jobRepository.findAll().get(0).getId();
        
        mockMvc.perform(get("/api/jobs/{id}", jobId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title", is("Software Engineer")))
                .andExpect(jsonPath("$.company", is("Tech Corp")));
    }

    @Test
    public void testCreateJob() throws Exception {
        Job newJob = new Job();
        newJob.setTitle("Data Scientist");
        newJob.setCompany("Data Corp");
        newJob.setLocation("New York, NY");
        newJob.setDescription("Analyzing data and building models");
        newJob.setRequirements("Python, R, Machine Learning");
        newJob.setSalary(130000.0);
        newJob.setContactEmail("jobs@datacorp.com");
        
        mockMvc.perform(post("/api/jobs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newJob)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title", is("Data Scientist")))
                .andExpect(jsonPath("$.company", is("Data Corp")));
        
        // Verify the job was saved to the database
        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    public void testUpdateJob() throws Exception {
        // Get the ID of the saved job
        Long jobId = jobRepository.findAll().get(0).getId();
        
        Job updatedJob = new Job();
        updatedJob.setTitle("Senior Software Engineer");
        updatedJob.setCompany("Tech Corp");
        updatedJob.setLocation("San Francisco, CA");
        updatedJob.setDescription("Leading development of web applications");
        updatedJob.setRequirements("Java, Spring Boot, MySQL, Leadership");
        updatedJob.setSalary(150000.0);
        updatedJob.setContactEmail("jobs@techcorp.com");
        
        mockMvc.perform(put("/api/jobs/{id}", jobId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedJob)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title", is("Senior Software Engineer")))
                .andExpect(jsonPath("$.description", is("Leading development of web applications")));
    }

    @Test
    public void testDeleteJob() throws Exception {
        // Get the ID of the saved job
        Long jobId = jobRepository.findAll().get(0).getId();
        
        mockMvc.perform(delete("/api/jobs/{id}", jobId))
                .andExpect(status().isNoContent());
        
        // Verify the job was deleted from the database
        mockMvc.perform(get("/api/jobs/{id}", jobId))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testSearchJobsByTitle() throws Exception {
        mockMvc.perform(get("/api/jobs/search/title")
                .param("title", "Software"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].title", containsString("Software")));
    }

    @Test
    public void testSearchJobsByCompany() throws Exception {
        mockMvc.perform(get("/api/jobs/search/company")
                .param("company", "Tech"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].company", is("Tech Corp")));
    }

    @Test
    public void testSearchJobsByLocation() throws Exception {
        mockMvc.perform(get("/api/jobs/search/location")
                .param("location", "San Francisco"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].location", is("San Francisco, CA")));
    }
} 