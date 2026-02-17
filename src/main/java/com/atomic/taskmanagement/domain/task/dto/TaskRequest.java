package com.atomic.taskmanagement.domain.task.dto;

import java.time.LocalDateTime;

import com.atomic.taskmanagement.config.util.OnCreate;
import com.atomic.taskmanagement.config.util.OnPatch;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskRequest(

    @NotBlank(message = "{validation.task.title.empty}",groups = {OnCreate.class})
    @Size(max = 100, message = "{validation.task.title.size.too_long}",groups = {OnCreate.class,OnPatch.class})
    String title, 

    String description,

    @JsonSetter(nulls = Nulls.AS_EMPTY) //defaults to false
    Boolean isCompleted, 

    LocalDateTime dueDate) {
    
}
