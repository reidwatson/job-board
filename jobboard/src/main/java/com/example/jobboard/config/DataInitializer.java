package com.example.jobboard.config;

import com.example.jobboard.model.User;
import com.example.jobboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Autowired
    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        // Create a demo user if it doesn't exist
        if (userRepository.count() == 0) {
            User user = new User();
            user.setEmail("demo@example.com");
            user.setFirstName("Demo");
            user.setLastName("User");
            user.setPassword("password");
            user.setSalt("salt");
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            
            System.out.println("Created demo user with ID: " + user.getId());
        }
    }
} 