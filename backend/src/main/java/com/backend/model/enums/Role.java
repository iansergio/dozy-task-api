package com.backend.model.enums;

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
