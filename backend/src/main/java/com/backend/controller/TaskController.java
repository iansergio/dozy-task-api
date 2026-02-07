package com.backend.controller;

import com.backend.dto.task.CreateTaskRequest;
import com.backend.dto.task.TaskResponse;
import com.backend.dto.task.UpdateTaskRequest;
import com.backend.dto.task.UpdateTaskStatusRequest;
import com.backend.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "Task managing endpoints")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Create a task")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "400", description = "Invalid data")
    })
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        TaskResponse savedTask = service.save(request);
        URI location = URI.create("/api/tasks/" + savedTask.getId());
        return ResponseEntity.created(location).body(savedTask);
    }

    @GetMapping
    @Operation(summary = "List all tasks")
    @ApiResponse(responseCode = "200", description = "<List>Tasks")
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        return ResponseEntity.ok(service.findAll());
    }

    @Operation(summary = "List a speciffic task")
    @ApiResponse(responseCode = "200", description = "<Object>Task")
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable UUID id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a task record")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Task deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Task information updated")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Task updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "404", description = "Task not found ")
    })
    @PatchMapping("/{id}/infos")
    public ResponseEntity<TaskResponse> updateTaskInfos(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskRequest request
    ) {
        TaskResponse updated = service.updateTaskInfos(id, request);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Task status update")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Task updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "404", description = "Task not found ")
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskStatusRequest request
    ) {
        TaskResponse updated = service.updateStatus(id, request);
        return ResponseEntity.ok(updated);
    }

}
