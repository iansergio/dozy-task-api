package com.backend.service.impl;

import com.backend.dto.request.RegisterRequest;
import com.backend.dto.response.FindUserByEmailResponse;
import com.backend.dto.request.UpdateUserPasswordRequest;
import com.backend.dto.response.UserResponse;
import com.backend.model.enums.Role;
import com.backend.model.entity.User;
import com.backend.exception.UserNotFoundException;
import com.backend.repository.UserRepository;
import com.backend.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse save(RegisterRequest request) {
        User user = new User(
                request.getEmail(),
                request.getPassword(),
                Role.USER,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        User savedUser = userRepository.save(user);
        return UserResponse.from(savedUser);
    }

    @Override
    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @Override
    public Optional<FindUserByEmailResponse> findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(FindUserByEmailResponse::from);
    }

    @Override
    public void delete(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        userRepository.delete(user);
    }

    @Override
    public UserResponse updateUserPassword(UUID id, UpdateUserPasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        user.setPassword(request.getPassword());
        user.setUpdatedAt(LocalDateTime.now());

        User updated = userRepository.save(user);
        return UserResponse.from(updated);
    }
}
