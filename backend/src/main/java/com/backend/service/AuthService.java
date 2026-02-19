package com.backend.service;

import com.backend.dto.response.AuthResponse;
import com.backend.dto.request.LoginRequest;
import com.backend.dto.request.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(String token);
}
