package com.atomic.taskmanagement.domain.task.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public record TaskResponse(
    Integer id, 
    String title, 
    String description,
    Boolean isCompleted, 
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime dueDate) {
    
}
