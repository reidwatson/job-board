package com.example.jobboard.util;

import org.springframework.stereotype.Component;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class PasswordUtils {

    private static final int SALT_LENGTH = 16;
    private static final String HASH_ALGORITHM = "SHA-256";
    
    /**
     * Generates a random salt for password hashing
     * 
     * @return a Base64 encoded salt string
     */
    public String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[SALT_LENGTH];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }
    
    /**
     * Hashes a password with the provided salt
     * 
     * @param password the plain text password
     * @param salt the salt to use for hashing
     * @return the hashed password
     */
    public String hashPassword(String password, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance(HASH_ALGORITHM);
            md.update(Base64.getDecoder().decode(salt));
            byte[] hashedPassword = md.digest(password.getBytes());
            return Base64.getEncoder().encodeToString(hashedPassword);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
    
    /**
     * Verifies if a plain text password matches a hashed password
     * 
     * @param plainPassword the plain text password to verify
     * @param hashedPassword the hashed password to compare against
     * @param salt the salt used for hashing
     * @return true if the passwords match, false otherwise
     */
    public boolean verifyPassword(String plainPassword, String hashedPassword, String salt) {
        String hashedInput = hashPassword(plainPassword, salt);
        return hashedInput.equals(hashedPassword);
    }
} 