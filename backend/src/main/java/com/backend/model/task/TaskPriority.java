package com.backend.model.task;

import lombok.Getter;

@Getter
public enum TaskPriority {
    HIGH("HIGH"),
    MEDIUM("MEDIUM"),
    LOW("LOW");

    private final String value;

    TaskPriority(String value) {
        this.value = value;
    }
}
