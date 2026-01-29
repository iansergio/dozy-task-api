package com.backend.controller;

import com.backend.domain.task.Task;
import com.backend.dto.SaveTaskRequest;
import com.backend.dto.TaskResponse;
import com.backend.dto.UpdateTaskInfosRequest;
import com.backend.dto.UpdateTaskStatusRequest;
import com.backend.service.TaskService;
import jakarta.validation.Valid;
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
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody SaveTaskRequest request) {
        TaskResponse savedTask = service.save(request);
        URI location = URI.create("/api/tasks/" + savedTask.getId());
        return ResponseEntity.created(location).body(savedTask);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable UUID id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TaskResponse> deleteTask(@PathVariable UUID id) {
        return ResponseEntity.ok(service.delete(id));
    }

    @PatchMapping("/{id}/infos")
    public ResponseEntity<TaskResponse> updateTaskInfos(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskInfosRequest request
    ) {
        TaskResponse updated = service.updateTaskInfo(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskStatusRequest request
    ) {
        TaskResponse updated = service.updateStatus(id, request);
        return ResponseEntity.ok(updated);
    }

}
