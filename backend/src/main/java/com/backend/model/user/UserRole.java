package com.backend.model.user;

import lombok.Getter;

@Getter
public enum UserRole {
    ADMIN(1),
    USER(0);

    private final int value;

    UserRole(int value) {
        this.value = value;
    }
}
