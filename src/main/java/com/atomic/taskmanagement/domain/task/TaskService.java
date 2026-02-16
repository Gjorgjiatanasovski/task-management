package com.atomic.taskmanagement.domain.task;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.atomic.taskmanagement.domain.task.dto.TaskRequest;
import com.atomic.taskmanagement.domain.task.dto.TaskResponse;


public interface TaskService {

    TaskResponse saveTask(TaskRequest request);

    TaskResponse findTaskById(Integer id);

    List<TaskResponse> findAllTasks();

    Page<TaskResponse> getTasksPaged(Pageable pageable);

    TaskResponse updateTask(Integer id, TaskRequest taskDetails);

    void deleteTask(Integer id);
}