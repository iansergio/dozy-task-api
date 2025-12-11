package com.backend.enums;

import lombok.Getter;

@Getter
public enum Status {
    PENDING("PENDING"),
    FINISHED("FINISHED");

    private final String value;

    Status(String value) {
        this.value = value;
    }
}
