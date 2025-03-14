package com.example.jobboard.dto;

public class AuthResponse {

    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String token;
    private boolean success;
    private String message;

    // Default constructor
    public AuthResponse() {
    }

    // Constructor for successful authentication
    public AuthResponse(Long userId, String email, String firstName, String lastName, String token) {
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.token = token;
        this.success = true;
        this.message = "Authentication successful";
    }

    // Constructor for failed authentication
    public AuthResponse(String message) {
        this.success = false;
        this.message = message;
    }

    // Getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
} 