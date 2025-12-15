package com.backend.service.impl;

import com.backend.dto.TaskRequest;
import com.backend.dto.TaskResponse;
import com.backend.entity.Task;
import com.backend.repository.TaskRepository;
import com.backend.service.TaskService;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository repository;

    public TaskServiceImpl(TaskRepository repository) {
        this.repository = repository;
    }

    @Override
    public TaskResponse save(TaskRequest request) {
        Task task = repository.save(new Task(request));

        return new TaskResponse(task);
    }
}
