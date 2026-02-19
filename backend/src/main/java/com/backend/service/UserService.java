package com.backend.service;

import com.backend.dto.request.RegisterRequest;
import com.backend.dto.response.FindUserByEmailResponse;
import com.backend.dto.request.UpdateUserPasswordRequest;
import com.backend.dto.response.UserResponse;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserService {
    UserResponse save(RegisterRequest request);
    List<UserResponse> findAll();
    Optional<FindUserByEmailResponse> findByEmail(String email);
    void delete(UUID id);
    UserResponse updateUserPassword(UUID id, UpdateUserPasswordRequest user);
}
