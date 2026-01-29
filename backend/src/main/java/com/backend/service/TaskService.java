package com.backend.service;

import com.backend.domain.task.Task;
import com.backend.dto.SaveTaskRequest;
import com.backend.dto.TaskResponse;
import com.backend.dto.UpdateTaskInfosRequest;
import com.backend.dto.UpdateTaskStatusRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskService {
    TaskResponse save(SaveTaskRequest request);
    List<TaskResponse> findAll();
    Optional<TaskResponse> findById(UUID id);
    TaskResponse delete(UUID id);
    TaskResponse updateTaskInfo(UUID id, UpdateTaskInfosRequest request);
    TaskResponse updateStatus(UUID id, UpdateTaskStatusRequest request);
}
