package com.example.jobboard;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public abstract class BaseTest {
    // Base class for all tests
    // This ensures that all tests use the test profile
    // which uses the H2 in-memory database
} 