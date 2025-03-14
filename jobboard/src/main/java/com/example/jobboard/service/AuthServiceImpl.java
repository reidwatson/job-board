package com.example.jobboard.service;

import com.example.jobboard.dto.AuthResponse;
import com.example.jobboard.dto.LoginRequest;
import com.example.jobboard.dto.SignupRequest;
import com.example.jobboard.model.User;
import com.example.jobboard.repository.UserRepository;
import com.example.jobboard.util.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordUtils passwordUtils;
    
    // Simple in-memory token store (in a real app, you'd use Redis or a database)
    private final Map<String, Long> tokenStore = new HashMap<>();

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, PasswordUtils passwordUtils) {
        this.userRepository = userRepository;
        this.passwordUtils = passwordUtils;
    }

    @Override
    public AuthResponse signup(SignupRequest signupRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return new AuthResponse("Email already in use");
        }

        // Generate salt and hash password
        String salt = passwordUtils.generateSalt();
        String hashedPassword = passwordUtils.hashPassword(signupRequest.getPassword(), salt);

        // Create new user
        User user = new User(
                signupRequest.getEmail(),
                hashedPassword,
                salt,
                signupRequest.getFirstName(),
                signupRequest.getLastName()
        );

        // Save user to database
        User savedUser = userRepository.save(user);

        // Generate token
        String token = generateToken(savedUser);

        // Store token
        tokenStore.put(token, savedUser.getId());

        // Return response
        return new AuthResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                token
        );
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        // Find user by email
        return userRepository.findByEmail(loginRequest.getEmail())
                .map(user -> {
                    // Verify password
                    if (passwordUtils.verifyPassword(loginRequest.getPassword(), user.getPassword(), user.getSalt())) {
                        // Generate token
                        String token = generateToken(user);
                        
                        // Store token
                        tokenStore.put(token, user.getId());
                        
                        // Update last login time
                        user.setUpdatedAt(LocalDateTime.now());
                        userRepository.save(user);
                        
                        // Return successful response
                        return new AuthResponse(
                                user.getId(),
                                user.getEmail(),
                                user.getFirstName(),
                                user.getLastName(),
                                token
                        );
                    } else {
                        // Return failed response
                        return new AuthResponse("Invalid password");
                    }
                })
                .orElse(new AuthResponse("User not found"));
    }

    @Override
    public boolean validateToken(String token) {
        return tokenStore.containsKey(token);
    }
    
    /**
     * Generate a simple token for the user
     * 
     * @param user the user to generate a token for
     * @return the generated token
     */
    private String generateToken(User user) {
        // In a real application, you would use JWT or another token standard
        // This is a simple implementation for demonstration purposes
        String tokenData = user.getId() + ":" + user.getEmail() + ":" + UUID.randomUUID();
        return Base64.getEncoder().encodeToString(tokenData.getBytes(StandardCharsets.UTF_8));
    }
} 