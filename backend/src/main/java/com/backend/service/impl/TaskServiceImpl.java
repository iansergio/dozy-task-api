package com.backend.service.impl;

import com.backend.model.task.Task;
import com.backend.model.task.TaskStatus;
import com.backend.model.user.User;
import com.backend.dto.SaveTaskRequest;
import com.backend.dto.TaskResponse;
import com.backend.dto.UpdateTaskInfosRequest;
import com.backend.dto.UpdateTaskStatusRequest;
import com.backend.repository.TaskRepository;
import com.backend.repository.UserRepository;
import com.backend.service.TaskService;
import org.springframework.stereotype.Service;

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
    public TaskResponse save(SaveTaskRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NoSuchElementException("User associated with task not found"));

        if (request.getStatus() == null) {
            request.setStatus(TaskStatus.PENDING);
        }

        Task task = new Task(
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                request.getStatus(),
                request.getDueDate(),
                user
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
    public TaskResponse delete(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Task not found with id: " + id));

        taskRepository.delete(task);

        return TaskResponse.from(task);
    }

    @Override
    public TaskResponse updateStatus(UUID id, UpdateTaskStatusRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Task not found"));

        task.setStatus(request.getStatus());

        Task updated = taskRepository.save(task);

        return TaskResponse.from(updated);
    }

    @Override
    public TaskResponse updateTaskInfos(UUID id, UpdateTaskInfosRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Task not found"));
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

        Task updated = taskRepository.save(task);

        return TaskResponse.from(updated);
    }
}
