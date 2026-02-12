package com.backend.service.impl;

import com.backend.dto.auth.AuthResponse;
import com.backend.dto.auth.LoginRequest;
import com.backend.dto.auth.RegisterRequest;
import com.backend.entity.user.Role;
import com.backend.entity.user.User;
import com.backend.repository.UserRepository;
import com.backend.service.AuthService;
import com.backend.service.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        // Gera token
        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
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

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getName(),
                "Logged in successfully");
    }
}
