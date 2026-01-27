package com.backend.service.impl;

import com.backend.domain.task.Task;
import com.backend.dto.TaskRequestDTO;
import com.backend.repository.TaskRepository;
import com.backend.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository repository;

    public TaskServiceImpl(TaskRepository repository) {
        this.repository = repository;
    }

    @Override
    public Task create(TaskRequestDTO dto) {
        Task task = new Task(
                dto.title(),
                dto.description(),
                dto.priority(),
                dto.status(),
                dto.dueDate(),
                dto.userId()
        );

        return repository.save(task);
    }

    @Override
    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public Optional<Task> getTaskById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public void delete(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public Task update(UUID id, Task task) {
        Task updatedTask = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        updatedTask.setTitle(task.getTitle());
        updatedTask.setDescription(task.getDescription());
        updatedTask.setPriority(task.getPriority());
        updatedTask.setStatus(task.getStatus());
        updatedTask.setDueDate(task.getDueDate());

        return repository.save(updatedTask);
    }
}
