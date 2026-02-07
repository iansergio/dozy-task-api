package com.backend.entity.user;

import lombok.Getter;

@Getter
public enum Role {
    ADMIN(1),
    USER(0);

    private final int value;

    Role(int value) {
        this.value = value;
    }
}
