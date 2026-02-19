package com.backend.controller;

import com.backend.dto.request.RegisterRequest;
import com.backend.dto.response.FindUserByEmailResponse;
import com.backend.dto.request.UpdateUserPasswordRequest;
import com.backend.dto.response.UserResponse;
import com.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody RegisterRequest request) {
        UserResponse savedUser = service.save(request);
        URI location = URI.create("/api/users/" + savedUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(location)
                .body(savedUser);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(service.findAll());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<FindUserByEmailResponse> getUserByEmail(@PathVariable String email) {
        return service.findByEmail(email)
                .map(user -> ResponseEntity.status(HttpStatus.OK).body(user))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<UserResponse> updateUserPassword(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserPasswordRequest request
    ) {
        UserResponse updated = service.updateUserPassword(id, request);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }
}
