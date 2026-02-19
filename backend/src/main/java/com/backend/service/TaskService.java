package com.backend.service;

import com.backend.dto.request.CreateTaskRequest;
import com.backend.dto.response.TaskResponse;
import com.backend.dto.request.UpdateTaskRequest;
import com.backend.dto.request.UpdateTaskStatusRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskService {
    TaskResponse save(CreateTaskRequest request);
    List<TaskResponse> findAll();
    Optional<TaskResponse> findById(UUID id);
    void delete(UUID id);
    TaskResponse updateTaskInfos(UUID id, UpdateTaskRequest request);
    TaskResponse updateStatus(UUID id, UpdateTaskStatusRequest request);
}
