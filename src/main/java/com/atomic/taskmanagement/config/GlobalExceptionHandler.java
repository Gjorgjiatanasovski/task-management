package com.atomic.taskmanagement.config;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.atomic.taskmanagement.config.dto.ConstraintViolationResponse;
import com.atomic.taskmanagement.config.dto.ErrorResponseRecord;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    
    private final MessageSource messageSource;

    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponseRecord<List<ConstraintViolationResponse>>> handleGlobalException(ConstraintViolationException ex) {
        // Format violations into a readable message or custom exception
            List<ConstraintViolationResponse> errorMessages = ex.getConstraintViolations().stream()
                .map(v -> {
                    return new ConstraintViolationResponse(v.getPropertyPath().toString(),v.getMessage());
                })
                .collect(Collectors.toList());
        ErrorResponseRecord<List<ConstraintViolationResponse>> errorResponse = 
            new ErrorResponseRecord<List<ConstraintViolationResponse>>(errorMessages,
                ex.getMessage(), HttpStatus.BAD_REQUEST.value(), System.currentTimeMillis());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseRecord> handleGlobalException(ResourceNotFoundException ex) {
        log.debug(ex.getMessage());
        ErrorResponseRecord errorResponse = new ErrorResponseRecord<>(null,ex.getMessage(), HttpStatus.NOT_FOUND.value(), System.currentTimeMillis());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseRecord> handleGlobalException(Exception ex) {
        log.debug(ex.getMessage());
        ErrorResponseRecord errorResponse = new ErrorResponseRecord<>(null,getMsg("exception_handler.internal_error", new Object()), HttpStatus.INTERNAL_SERVER_ERROR.value(), System.currentTimeMillis());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private String getMsg(String key,Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }
    
}
