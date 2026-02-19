package com.backend.controller;

import com.backend.dto.request.CreateTaskRequest;
import com.backend.dto.response.TaskResponse;
import com.backend.dto.request.UpdateTaskRequest;
import com.backend.dto.request.UpdateTaskStatusRequest;
import com.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        TaskResponse savedTask = service.save(request);
        URI location = URI.create("/api/tasks/" + savedTask.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(location)
                .body(savedTask);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable UUID id) {
        return service.findById(id)
                .map(entity -> ResponseEntity.status(HttpStatus.OK).body(entity))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/{id}/infos")
    public ResponseEntity<TaskResponse> updateTaskInfos(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskRequest request
    ) {
        TaskResponse updated = service.updateTaskInfos(id, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskStatusRequest request
    ) {
        TaskResponse updated = service.updateStatus(id, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(updated);
    }

}
