package com.backend.dto.request;

import com.backend.model.enums.Priority;
import com.backend.model.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class CreateTaskRequest {

        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        @NotNull(message = "Priority is required")
        private Priority priority; // HIGH, MEDIUM, LOW

        private Status status; // PENDING, COMPLETED

        @NotNull(message = "Due date is required")
        private LocalDateTime dueDate;

        @NotNull(message = "User ID is required")
        private UUID userId;
}
