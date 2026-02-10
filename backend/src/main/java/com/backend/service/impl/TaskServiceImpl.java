package com.backend.service.impl;

import com.backend.entity.task.Task;
import com.backend.entity.task.Status;
import com.backend.entity.user.User;
import com.backend.dto.task.CreateTaskRequest;
import com.backend.dto.task.TaskResponse;
import com.backend.dto.task.UpdateTaskRequest;
import com.backend.dto.task.UpdateTaskStatusRequest;
import com.backend.exception.TaskNotFoundException;
import com.backend.repository.TaskRepository;
import com.backend.repository.UserRepository;
import com.backend.service.TaskService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TaskResponse save(CreateTaskRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NoSuchElementException("User associated with task not found"));

        if (request.getStatus() == null) {
            request.setStatus(Status.PENDING);
        }

        Task task = new Task(
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                request.getStatus(),
                request.getDueDate(),
                user,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        Task savedTask = taskRepository.save(task);

        return new TaskResponse(
                savedTask.getId(),
                savedTask.getTitle(),
                savedTask.getDescription(),
                savedTask.getPriority(),
                savedTask.getStatus(),
                savedTask.getDueDate(),
                savedTask.getUser().getId()
        );
    }

    @Override
    public List<TaskResponse> findAll() {
        return taskRepository.findAll()
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    public Optional<TaskResponse> findById(UUID id) {
        return taskRepository.findById(id)
                .map(TaskResponse::from);
    }

    @Override
    public void delete(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        taskRepository.delete(task);
    }

    @Override
    public TaskResponse updateTaskInfos(UUID id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }

        if(request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }

        if(request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        if(request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        task.setUpdatedAt(LocalDateTime.now());

        Task updated = taskRepository.save(task);
        return TaskResponse.from(updated);
    }

    @Override
    public TaskResponse updateStatus(UUID id, UpdateTaskStatusRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        task.setStatus(request.getStatus());
        task.setUpdatedAt(LocalDateTime.now());

        Task updated = taskRepository.save(task);
        return TaskResponse.from(updated);
    }
}
