package com.backend.dto;

import com.backend.entity.Task;
import com.backend.enums.Priority;

import java.util.UUID;

public record TaskResponse(UUID id, String title, String description, Priority priority) {
    public TaskResponse(Task task) {
        this(task.getId(), task.getTitle(), task.getDescription(), task.getPriority());
    }
}
