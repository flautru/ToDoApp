package com.fabien.ToDoApp.mapper;

import com.fabien.ToDoApp.dto.TaskDto;
import com.fabien.ToDoApp.model.Task;

public class TaskMapper {

    public static TaskDto toDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setLabel(task.getLabel());
        dto.setDescription(task.getDescription());
        dto.setCompleted(task.isCompleted());
        return dto;
    }

    public static Task toEntity(TaskDto dto) {
        Task task = new Task();
        task.setId(dto.getId());
        task.setLabel(dto.getLabel());
        task.setDescription(dto.getDescription());
        task.setCompleted(Boolean.TRUE.equals(dto.getCompleted()));
        return task;
    }
}
