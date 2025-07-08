package com.fabien.ToDoApp.mapper;

import com.fabien.ToDoApp.dto.TaskDto;
import com.fabien.ToDoApp.model.Task;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TaskMapperTest {

    @Test
    void givenValidTask_whenMapToDto_thenReturnTaskDto() {
        Task task = new Task(1L, "Test Task", "Test description", true);

        TaskDto taskDto = TaskMapper.toDto(task);

        assertEquals(task.getId(), taskDto.getId());
        assertEquals(task.getLabel(), taskDto.getLabel());
        assertEquals(task.getDescription(), taskDto.getDescription());
        assertEquals(task.isCompleted(), taskDto.getCompleted());
    }

    @Test
    void givenValidTaskDto_whenMapToDto_thenReturnTask() {
        TaskDto taskDto = new TaskDto(1L, "Test Task", "Test description", true);

        Task task = TaskMapper.toEntity(taskDto);

        assertEquals(taskDto.getId(), task.getId());
        assertEquals(taskDto.getLabel(), task.getLabel());
        assertEquals(taskDto.getDescription(), task.getDescription());
        assertEquals(taskDto.getCompleted(), task.isCompleted());
    }

    @Test
    void givenValidTaskWithNullValue_whenMapToDto_thenReturnTaskDtoWithNullValue() {
        Task task = new Task();

        TaskDto taskDto = TaskMapper.toDto(task);

        assertNull(taskDto.getId());
        assertNull(taskDto.getLabel());
        assertNull(taskDto.getDescription());
        assertFalse(taskDto.getCompleted());
    }

    @Test
    void givenValidTaskDtoWithNullValue_whenMapToDto_thenReturnTaskWithNullValue() {
        TaskDto taskDto = new TaskDto();

        Task task = TaskMapper.toEntity(taskDto);

        assertNull(task.getId());
        assertNull(task.getLabel());
        assertNull(task.getDescription());
        assertFalse(task.isCompleted());
    }
}