package com.backend.service;

import com.backend.domain.task.Task;
import com.backend.dto.TaskRequestDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskService {
    Task create(TaskRequestDTO task);
    List<Task> getAllTasks();
    Optional<Task> getTaskById(UUID id);
    void delete(UUID id);
    Task update(UUID id, Task request);
}
