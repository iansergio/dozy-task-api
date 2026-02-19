package com.backend.repository;

import com.backend.model.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    void deleteByUserId(UUID userId);
    void deleteByToken(String token);
    Optional<RefreshToken> findByToken(String token);
}
