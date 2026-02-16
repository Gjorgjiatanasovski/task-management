package com.atomic.taskmanagement.config.dto;

public record ConstraintViolationResponse(String fieldName, String violation) {
    
}
