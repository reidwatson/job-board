package com.example.jobboard.service;

import com.example.jobboard.dto.AuthResponse;
import com.example.jobboard.dto.LoginRequest;
import com.example.jobboard.dto.SignupRequest;

public interface AuthService {
    
    /**
     * Register a new user
     * 
     * @param signupRequest the signup request containing user details
     * @return authentication response with user details and token
     */
    AuthResponse signup(SignupRequest signupRequest);
    
    /**
     * Authenticate a user
     * 
     * @param loginRequest the login request containing credentials
     * @return authentication response with user details and token
     */
    AuthResponse login(LoginRequest loginRequest);
    
    /**
     * Validate a token
     * 
     * @param token the token to validate
     * @return true if the token is valid, false otherwise
     */
    boolean validateToken(String token);
} 