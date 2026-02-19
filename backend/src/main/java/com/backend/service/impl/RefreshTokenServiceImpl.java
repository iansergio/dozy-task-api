package com.backend.service.impl;

import com.backend.model.entity.RefreshToken;
import com.backend.repository.RefreshTokenRepository;
import com.backend.service.RefreshTokenService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    @Value("${jwt.refresh.expiration}")
    private int refreshTokenExpirationTime;

    private final RefreshTokenRepository repository;

    public RefreshTokenServiceImpl(RefreshTokenRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public RefreshToken createRefreshToken(UUID userId) {
        repository.deleteByUserId(userId);

        RefreshToken token = new RefreshToken();
        token.setUserId(userId);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(LocalDateTime.now().plusDays(refreshTokenExpirationTime));
        token.setCreatedAt(LocalDateTime.now());

        return repository.save(token);
    }

    @Override
    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            repository.deleteByToken(token.getToken());
            throw new RuntimeException("Refresh token expired. Log in again to get a new one.");
        }
        return token;
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return repository.findByToken(token);
    }
}
