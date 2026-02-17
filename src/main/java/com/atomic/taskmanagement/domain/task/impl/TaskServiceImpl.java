package com.atomic.taskmanagement.domain.task.impl;

import java.util.List;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.atomic.taskmanagement.domain.task.Task;
import com.atomic.taskmanagement.domain.task.TaskRepository;
import com.atomic.taskmanagement.domain.task.TaskService;
import com.atomic.taskmanagement.domain.task.dto.TaskRequest;
import com.atomic.taskmanagement.domain.task.dto.TaskResponse;
import com.atomic.taskmanagement.domain.task.util.TaskMapper;

@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final MessageSource messageSource;

    public TaskServiceImpl(TaskRepository taskRepository, 
            TaskMapper taskMapper, MessageSource messageSource) { 
        this.taskRepository = taskRepository; 
        this.taskMapper = taskMapper;
        this.messageSource = messageSource;
    }

    @Override
    public TaskResponse saveTask(TaskRequest request) {
        Task task = taskMapper.toEntity(request);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse findTaskById(Integer id) {
        return taskRepository.findById(id).map(taskMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(getMsg("validation.task.find_by_id_error", id)));
    }

    @Override
    public List<TaskResponse> findAllTasks() {
        return taskRepository.findAll().stream().map(taskMapper::toResponse).toList();
    }

    @Override
    public Page<TaskResponse> getTasksPaged(Pageable pageable) {
        // Fetch the page of entities from the DB
        Page<Task> taskPage = taskRepository.findAll(pageable);
        
        // Map the entities to DTOs while preserving pagination metadata
        return taskPage.map(taskMapper::toResponse); //empty list if out of bounds
    }

    @Override
    public TaskResponse updateTask(Integer id, TaskRequest taskDetails) {
        return taskRepository.findById(id).map(existingTask -> {
            Task updated = taskMapper.toEntityPatch(existingTask, taskDetails);
            taskRepository.save(updated);
            return taskMapper.toResponse(updated);
        }).orElseThrow(() -> new ResourceNotFoundException(getMsg("validation.task.update_error", id)));
    }

    @Override
    public void deleteTask(Integer id) {
        taskRepository.findById(id).ifPresentOrElse(
            taskRepository::delete,
            () -> { throw new ResourceNotFoundException(getMsg("validation.task.delete_by_id", id)); }
        );
    }

    private String getMsg(String key,Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }
}
