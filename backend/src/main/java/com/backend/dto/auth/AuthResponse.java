package com.backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String message;

    public AuthResponse(String token, String email, String name, String message) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.message = message;
    }
}
