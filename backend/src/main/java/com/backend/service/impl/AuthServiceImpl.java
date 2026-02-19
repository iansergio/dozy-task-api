package com.backend.service.impl;

import com.backend.dto.response.AuthResponse;
import com.backend.dto.request.LoginRequest;
import com.backend.dto.request.RegisterRequest;
import com.backend.model.entity.RefreshToken;
import com.backend.model.enums.Role;
import com.backend.model.entity.User;
import com.backend.repository.UserRepository;
import com.backend.service.AuthService;
import com.backend.service.JwtService;
import com.backend.service.RefreshTokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            RefreshTokenService refreshTokenService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Cria novo usuário
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setEmailVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        // Gera token
        String accessToken = jwtService.generateToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                user.getEmail(),
                user.getName(),
                "User registered"
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Busca usuário
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Verifica senha
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Gera token
        String token = jwtService.generateToken(user.getEmail());
        RefreshToken refreshToken  = refreshTokenService.createRefreshToken(user.getId());

        return new AuthResponse(
                token,
                refreshToken.getToken(),
                user.getEmail(),
                user.getName(),
                "Logged in successfully");
    }

    @Override
    public AuthResponse refresh(String tokenStr) {
        RefreshToken token = refreshTokenService
                .findByToken(tokenStr)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        refreshTokenService.verifyExpiration(token);

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                newAccessToken,
                token.getToken(),
                user.getEmail(),
                user.getName(),
                "Token refreshed successfully"
        );
    }
}
