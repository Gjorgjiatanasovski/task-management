package com.atomic.taskmanagement.domain.task.util;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.atomic.taskmanagement.domain.task.Task;
import com.atomic.taskmanagement.domain.task.dto.TaskRequest;
import com.atomic.taskmanagement.domain.task.dto.TaskResponse;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING) 
public interface TaskMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "title",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "description",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "isCompleted",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "dueDate",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public Task toEntityPatch(@MappingTarget Task task, TaskRequest request);

    @Mapping(target = "id", ignore = true)
    public Task toEntity(TaskRequest request);
    
    public TaskResponse toResponse(Task task);
    
}
