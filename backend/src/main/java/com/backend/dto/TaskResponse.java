package com.backend.dto;

import com.backend.domain.task.Task;
import com.backend.domain.task.TaskPriority;
import com.backend.domain.task.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@Getter
public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDateTime dueDate;
    private UUID userId;

    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority(),
                task.getStatus(),
                task.getDueDate(),
                task.getUser().getId()
        );
    }
}


