package com.atomic.taskmanagement.config.dto;

public record ErrorResponseRecord<T>(T errors, String message, int status, long timestamp) {
    
}
