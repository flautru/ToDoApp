package com.fabien.ToDoApp.integration;

import com.fabien.ToDoApp.dto.TaskCompletionRequestDto;
import com.fabien.ToDoApp.model.Task;
import com.fabien.ToDoApp.repository.TaskRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@AutoConfigureTestDatabase
public class TaskIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        taskRepository.deleteAll();
    }

    @Test
    @DisplayName("GET /api/tasks without tasks returns 204 No Content")
    void givenNoTasks_whenGetAllTasks_thenNoContent() throws Exception {
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("POST /api/tasks creates a new task")
    void whenCreateTask_thenReturnCreatedTask() throws Exception {
        Task task = new Task(null, "Test task", "Description test", false);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.label").value("Test task"))
                .andExpect(jsonPath("$.completed").value(false));
    }

    @Test
    @DisplayName("GET /api/tasks returns all tasks")
    void givenTasks_whenGetAllTasks_thenReturnTasks() throws Exception {
        Task t1 = new Task(null, "Task 1", "Desc 1", false);
        Task t2 = new Task(null, "Task 2", "Desc 2", true);
        taskRepository.saveAll(List.of(t1, t2));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(2)))
                .andExpect(jsonPath("$[0].label", is("Task 1")))
                .andExpect(jsonPath("$[1].completed", is(true)));
    }

    @Test
    @DisplayName("GET /api/tasks?completed=true returns only completed tasks")
    void whenGetTasksByCompletedTrue_thenReturnOnlyCompletedTasks() throws Exception {
        Task t1 = new Task(null, "Task 1", "Desc 1", false);
        Task t2 = new Task(null, "Task 2", "Desc 2", true);
        taskRepository.saveAll(List.of(t1, t2));

        mockMvc.perform(get("/api/tasks").param("completed", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].completed", is(true)))
                .andExpect(jsonPath("$[0].label", is("Task 2")));
    }

    @Test
    @DisplayName("GET /api/tasks/{id} returns task by id")
    void whenGetTaskById_thenReturnTask() throws Exception {
        Task saved = taskRepository.save(new Task(null, "Task X", "Desc X", false));

        mockMvc.perform(get("/api/tasks/{id}", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.label").value("Task X"));
    }

    @Test
    @DisplayName("PUT /api/tasks/{id} updates task")
    void whenUpdateTask_thenReturnUpdatedTask() throws Exception {
        Task saved = taskRepository.save(new Task(null, "Old label", "Old desc", false));
        Task updated = new Task(null, "Updated label", "Updated desc", true);

        mockMvc.perform(put("/api/tasks/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.label").value("Updated label"))
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    @DisplayName("PATCH /api/tasks/{id}/status updates completion status")
    void whenPatchStatus_thenReturnUpdatedTask() throws Exception {
        Task saved = taskRepository.save(new Task(null, "Task Patch", "Desc", false));
        TaskCompletionRequestDto statusDto = new TaskCompletionRequestDto();
        statusDto.setCompleted(true);

        mockMvc.perform(patch("/api/tasks/{id}/status", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    @DisplayName("DELETE /api/tasks/{id} deletes task")
    void whenDeleteTask_thenReturnNoContent() throws Exception {
        Task saved = taskRepository.save(new Task(null, "To delete", "desc", false));

        mockMvc.perform(delete("/api/tasks/{id}", saved.getId()))
                .andExpect(status().isNoContent());
    }
}
