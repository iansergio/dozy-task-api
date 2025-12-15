package com.backend.dto;

import com.backend.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskRequest(
        @NotBlank
        @Size(min = 3, max = 200)
        String title,

        @NotBlank
        String description,
        
        Priority priority

) {
}
