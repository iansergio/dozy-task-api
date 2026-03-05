package com.backend.controller;

import com.backend.dto.request.RegisterRequest;
import com.backend.dto.response.FindUserByEmailResponse;
import com.backend.dto.request.UpdateUserPasswordRequest;
import com.backend.dto.response.UserResponse;
import com.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody RegisterRequest request) {
        UserResponse savedUser = service.save(request);
        URI location = URI.create("/api/users/" + savedUser.id());
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(location)
                .body(savedUser);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAll() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(service.findAll());
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FindUserByEmailResponse> getByEmail(@PathVariable String email) {
        return service.findByEmail(email)
                .map(user -> ResponseEntity.status(HttpStatus.OK).body(user))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<UserResponse> patchPassword(
            @AuthenticationPrincipal String userEmail,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserPasswordRequest request
    ) {
        UserResponse updated = service.updatePassword(id, request, userEmail);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }

    @PatchMapping("/me/password")
    public ResponseEntity<UserResponse> patchMyPassword(
            @AuthenticationPrincipal String userEmail,
            @Valid @RequestBody UpdateUserPasswordRequest request
    ) {
        UserResponse updated = service.updatePasswordByEmail(userEmail, request);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }
}
