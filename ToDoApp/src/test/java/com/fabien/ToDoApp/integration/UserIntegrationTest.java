package com.fabien.ToDoApp.integration;

import com.fabien.ToDoApp.model.User;
import com.fabien.ToDoApp.repository.UserRepository;
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

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@AutoConfigureTestDatabase
class UserIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("givenValidUser_whenAddUser_thenReturnCreatedUserDto")
    void givenValidUser_whenAddUser_thenReturnCreatedUserDto() throws Exception {
        User user = new User(null, "johnDoe", "password123", "USER");

        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").value("johnDoe"))
                .andExpect(jsonPath("$.role").value("USER"));

        assertThat(userRepository.findAll()).hasSize(1);
    }

    @Test
    @DisplayName("givenInvalidUser_whenAddUser_thenReturn400BadRequest")
    void givenInvalidUser_whenAddUser_thenReturn400BadRequest() throws Exception {
        User invalidUser = new User(null, "", "", "");

        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("givenExistingUsername_whenAddUser_thenReturn409Conflict")
    void givenExistingUsername_whenAddUser_thenReturn409Conflict() throws Exception {
        User user = new User(null, "johnDoe", "pass", "USER");
        userRepository.save(user);

        User duplicateUser = new User(null, "johnDoe", "anotherPass", "USER");

        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateUser)))
                .andExpect(status().isConflict())
                .andExpect(content().string("Username johnDoe already exist, try another one"));
    }

    @Test
    @DisplayName("givenExistingUserId_whenGetUserById_thenReturnUserDto")
    void givenExistingUserId_whenGetUserById_thenReturnUserDto() throws Exception {
        User user = new User(null, "alice", "secret", "ADMIN");
        User saved = userRepository.save(user);

        mockMvc.perform(get("/api/users/{id}", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.username").value("alice"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    @DisplayName("givenNonExistingUserId_whenGetUserById_thenReturn404")
    void givenNonExistingUserId_whenGetUserById_thenReturn404() throws Exception {
        mockMvc.perform(get("/api/users/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("givenExistingUserId_whenDeleteUser_thenReturn204NoContent")
    void givenExistingUserId_whenDeleteUser_thenReturn204NoContent() throws Exception {
        User saved = userRepository.save(new User(null, "deleteMe", "pass", "USER"));

        mockMvc.perform(delete("/api/users/{id}", saved.getId()))
                .andExpect(status().isNoContent());

        Optional<User> deleted = userRepository.findById(saved.getId());
        assertThat(deleted).isEmpty();
    }

    @Test
    @DisplayName("givenNonExistingUserId_whenDeleteUser_thenReturn404NotFound")
    void givenNonExistingUserId_whenDeleteUser_thenReturn404NotFound() throws Exception {
        mockMvc.perform(delete("/api/users/{id}", 1234L))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("givenUsersInDatabase_whenGetUsersWithPagination_thenReturnPageOfUsers")
    void givenUsersInDatabase_whenGetUsersWithPagination_thenReturnPageOfUsers() throws Exception {
        userRepository.save(new User(null, "paginatedUser", "password", "USER"));

        mockMvc.perform(get("/api/users?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].username").value("paginatedUser"));
    }

    @Test
    @DisplayName("givenNoUsersInDatabase_whenGetUsersWithPagination_thenReturnEmptyPage")
    void givenNoUsersInDatabase_whenGetUsersWithPagination_thenReturnEmptyPage() throws Exception {
        mockMvc.perform(get("/api/users?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());
    }
}
