package com.example.jobboard.util;

import com.example.jobboard.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Utility class for handling JWT tokens
 * This is a simplified implementation for the demo application
 */
@Component
public class JwtUtil {

    private final AuthService authService;

    @Autowired
    public JwtUtil(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Extract the user ID from a token
     * 
     * @param token The JWT token
     * @return The user ID
     */
    public Long getUserIdFromToken(String token) {
        // Validate the token first
        if (!authService.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }
        
        // In our simplified implementation, we're using Base64 encoded strings
        // The format is userId:email:uuid
        try {
            String decodedToken = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
            String[] parts = decodedToken.split(":");
            if (parts.length >= 1) {
                return Long.parseLong(parts[0]);
            }
            throw new RuntimeException("Invalid token format");
        } catch (Exception e) {
            throw new RuntimeException("Error parsing token", e);
        }
    }
} 