package com.backend.dto.task;

import com.backend.entity.task.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTaskStatusRequest {

    @NotNull
    private Status status;

}
