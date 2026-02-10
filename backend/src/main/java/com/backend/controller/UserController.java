package com.backend.controller;

import com.backend.dto.user.RegisterRequest;
import com.backend.dto.user.FindUserByEmailResponse;
import com.backend.dto.user.UpdateUserPasswordRequest;
import com.backend.dto.user.UserResponse;
import com.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User managing endpoints")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Create a user")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid data")
    })
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody RegisterRequest request) {
        UserResponse savedUser = service.save(request);
        URI location = URI.create("/api/users/" + savedUser.getId());
        return ResponseEntity.created(location).body(savedUser);
    }

    @GetMapping
    @Operation(summary = "List all users")
    @ApiResponse(responseCode = "200", description = "List of users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Find user by email")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User found"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<FindUserByEmailResponse> getUserByEmail(@PathVariable String email) {
        return service.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user record")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "User deleted successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/password")
    @Operation(summary = "Update user password")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<UserResponse> updateUserPassword(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserPasswordRequest request
    ) {
        UserResponse updated = service.updateUserPassword(id, request);
        return ResponseEntity.ok(updated);
    }
}
