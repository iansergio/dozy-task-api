package com.backend.dto;

import com.backend.domain.task.TaskPriority;
import com.backend.domain.task.TaskStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskRequestDTO {

    @NotNull(message = "Title can not be null")
    private String title;

    @NotNull(message = "Description can not be null")
    private String description;

    private TaskPriority priority; // HIGH, MEDIUM, LOW
    private TaskStatus status; // PENDING, FINISHED

    @NotNull(message = "Date can not be null")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    LocalDateTime dueDate;

    @NotNull(message = "User id can not be null")
    private UUID userId;
}
