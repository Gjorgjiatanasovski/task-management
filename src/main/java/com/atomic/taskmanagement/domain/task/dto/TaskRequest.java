package com.atomic.taskmanagement.domain.task.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TaskRequest(

    @NotNull(message = "{validation.task.title.empty}")
    @NotBlank(message = "{validation.task.title.empty}")
    @Size(max = 100, message = "{validation.task.title.size.too_long}")
    String title, 

    String description,

    @JsonSetter(nulls = Nulls.AS_EMPTY) //defaults to false
    Boolean isCompleted, 

    LocalDateTime dueDate) {
    
}
