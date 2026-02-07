package com.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {

        @NotBlank(message = "Email is required")
        String email;

        @NotBlank(message = "Password is required")
        String password;
}
