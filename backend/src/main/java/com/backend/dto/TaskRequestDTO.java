package com.backend.dto;

import com.backend.domain.task.TaskPriority;
import com.backend.domain.task.TaskStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskRequestDTO(
        String title,
        String description,
        TaskPriority priority,
        TaskStatus status,
        LocalDateTime dueDate,
        UUID userId
) {}
