package com.backend.dto.user;

import com.backend.dto.task.TaskResponse;
import com.backend.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Getter
public class FindUserByEmailResponse {
    private UUID id;
    private String email;
    private String role;
    private List<TaskResponse> tasks;

    public static FindUserByEmailResponse from(User user) {
        return new FindUserByEmailResponse(
                user.getId(),
                user.getEmail(),
                user.getRole().toString(),
                user.getTasks().stream()
                        .map(TaskResponse::from)
                        .toList()
        );
    }
}
