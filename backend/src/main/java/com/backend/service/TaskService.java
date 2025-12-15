package com.backend.service;

import com.backend.dto.TaskRequest;
import com.backend.dto.TaskResponse;

public interface TaskService {
    TaskResponse save(TaskRequest request);
}
