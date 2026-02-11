package com.backend.service;

import io.jsonwebtoken.Claims;

import javax.crypto.SecretKey;
import java.util.Map;

public interface JwtService {
    String generateToken(String email);
    String createToken(Map<String, Object> claims, String subject);
    SecretKey getSignKey();
    String getEmailFromToken(String token);
    Claims getClaimsFromToken(String token);
    boolean validateToken(String token);
    boolean isTokenExpired(String token);
}
