package com.backend.dto;

import com.backend.model.task.TaskPriority;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateTaskInfosRequest {

    private String title;
    private String description;
    private TaskPriority priority;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime dueDate;
}
