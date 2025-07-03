package com.fabien.ToDoApp.controller;

import com.fabien.ToDoApp.dto.TaskDto;
import com.fabien.ToDoApp.exception.TaskNotFoundException;
import com.fabien.ToDoApp.mapper.TaskMapper;
import com.fabien.ToDoApp.model.Task;
import com.fabien.ToDoApp.service.impl.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/tasks - should return all tasks when no param")
    void shouldReturnAllTasks_whenNoFilterProvided() throws Exception {
        TaskDto taskDto1 = new TaskDto(1L, "Task 1", "Desc 1", false);
        TaskDto taskDto2 = new TaskDto(2L, "Task 2", "Desc 2", true);

        when(taskService.findAllTasks()).thenReturn(List.of(TaskMapper.toEntity(taskDto1), TaskMapper.toEntity(taskDto2)));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$.[0].id").value(1L))
                .andExpect(jsonPath("$.[1].id").value(2L))
                .andExpect(jsonPath("$.[0].label").value("Task 1"))
                .andExpect(jsonPath("$.[1].label").value("Task 2"));

        verify(taskService).findAllTasks();
    }

    @Test
    @DisplayName("GET /api/tasks?completed=true - should return only completed tasks")
    void shouldReturnCompleteTasks_whenCompletedStatusIsTrue() throws Exception {
        TaskDto completedTaskDto = new TaskDto(1L, "Completed Task", "Done", true);

        when(taskService.findTasksByCompletedStatus(true)).thenReturn(List.of(TaskMapper.toEntity(completedTaskDto)));

        mockMvc.perform(get("/api/tasks").param("completed", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].label").value("Completed Task"))
                .andExpect(jsonPath("$[0].completed").value(true));

        verify(taskService).findTasksByCompletedStatus(true);
    }

    @Test
    @DisplayName("GET /api/tasks?completed=false - should return only incomplete tasks")
    void shouldReturnIncompleteTasks_whenCompletedStatusIsFalse() throws Exception {
        TaskDto incompleteTaskDto = new TaskDto(2L, "Incomplete Task", "To do", false);

        when(taskService.findTasksByCompletedStatus(false)).thenReturn(List.of(TaskMapper.toEntity(incompleteTaskDto)));

        mockMvc.perform(get("/api/tasks").param("completed", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(2L))
                .andExpect(jsonPath("$[0].label").value("Incomplete Task"))
                .andExpect(jsonPath("$[0].completed").value(false));

        verify(taskService).findTasksByCompletedStatus(false);
    }

    @Test
    @DisplayName("GET /api/tasks/{id} - should return tasks by id")
    void shouldReturnTask_whenValidIdProvided() throws Exception {
        TaskDto taskDto = new TaskDto(1L, "Task 1", "Desc 1", false);

        when(taskService.findTaskById(1L)).thenReturn(TaskMapper.toEntity(taskDto));

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.label").value("Task 1"))
                .andExpect(jsonPath("$.description").value("Desc 1"))
                .andExpect(jsonPath("$.completed").value(false));

        verify(taskService).findTaskById(1L);
    }

    @Test
    @DisplayName("Post /api/tasks - should create a task")
    void shouldCreateAndReturnTask_whenValidTaskProvided() throws Exception {
        TaskDto taskDto = new TaskDto(1L, "Task 1", "Desc 1", false);

        when(taskService.saveTask(any(Task.class))).thenReturn(TaskMapper.toEntity(taskDto));

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(taskDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.label").value("Task 1"))
                .andExpect(jsonPath("$.description").value("Desc 1"))
                .andExpect(jsonPath("$.completed").value(false));

        verify(taskService).saveTask(any(Task.class));
    }

    @Test
    @DisplayName("Put /api/tasks/{id} - should update a task")
    void shouldUpdateAndReturnTask_whenValidIdProvided() throws Exception {
        TaskDto taskDto = new TaskDto(1L, "Task 1", "Desc 1", false);

        when(taskService.updateTaskById(eq(1L), any(Task.class))).thenReturn(TaskMapper.toEntity(taskDto));

        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(taskDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.label").value("Task 1"))
                .andExpect(jsonPath("$.description").value("Desc 1"))
                .andExpect(jsonPath("$.completed").value(false));

        verify(taskService).updateTaskById(eq(1L), any(Task.class));
    }

    @Test
    @DisplayName("Put /api/tasks/{id} - should return error when no found id")
    void shouldReturnError_whenUpdatingNonExistingId() throws Exception {
        Long taskId = 99L;
        TaskDto taskDto = new TaskDto(1L, "Task 1", "Desc 1", false);

        when(taskService.updateTaskById(eq(taskId), any(Task.class))).thenThrow(new TaskNotFoundException("Task not found with id : " + taskId));

        mockMvc.perform(put("/api/tasks/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(taskDto)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Task not found with id : " + taskId));

        verify(taskService).updateTaskById(eq(taskId), any(Task.class));
    }

    @Test
    @DisplayName("DElETE /api/tasks/{id} - should delete task by id")
    void shouldDeleteTaskAndReturnNoContent_whenValidIdProvided() throws Exception {
        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNoContent());

        verify(taskService).deleteTaskById(1L);
    }

    @Test
    @DisplayName("DElETE /api/tasks/{id} - should delete task by id")
    void shouldReturnError_whenDeleteNonExistingTaskById() throws Exception {
        Long taskId = 99L;
        doThrow(new TaskNotFoundException("Task not found with id : " + taskId)).when(taskService).deleteTaskById(taskId);
        mockMvc.perform(delete("/api/tasks/99"))
                .andExpect(status().isNotFound());

        verify(taskService).deleteTaskById(taskId);
    }

    @Test
    @DisplayName("PATCH /api/tasks/{id}/status - should update completed status task by id")
    void shouldTaskCompletedStatusUpdated_whenValidIdAndStatusProvided() throws Exception {
        Long taskId = 1L;
        boolean newStatus = false;
        TaskDto taskDto = new TaskDto(taskId, "Task 1", "Desc 1", false);

        when(taskService.updateCompletedStatusTaskById(taskId, newStatus)).thenReturn(TaskMapper.toEntity(taskDto));

        mockMvc.perform(patch("/api/tasks/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"completed\": false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(taskId))
                .andExpect(jsonPath("$.completed").value(false));

        verify(taskService).updateCompletedStatusTaskById(taskId, newStatus);
    }

    @Test
    @DisplayName("PATCH /api/tasks/{id}/status - should update completed status task by id")
    void shouldReturnBadRequest_whenValidIdAndInvalidStatusProvided() throws Exception {
        mockMvc.perform(patch("/api/tasks/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"completed\": notABoolean}"))
                .andExpect(status().isBadRequest());
    }
}