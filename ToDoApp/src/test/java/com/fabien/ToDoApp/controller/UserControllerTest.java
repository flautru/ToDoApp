package com.fabien.ToDoApp.controller;

import com.fabien.ToDoApp.dto.UserDto;
import com.fabien.ToDoApp.exception.UserNameAlreadyExistException;
import com.fabien.ToDoApp.exception.UserNotFoundException;
import com.fabien.ToDoApp.mapper.UserMapper;
import com.fabien.ToDoApp.model.User;
import com.fabien.ToDoApp.security.jwt.JwtAuthenticationFilter;
import com.fabien.ToDoApp.security.jwt.JwtUtils;
import com.fabien.ToDoApp.service.user.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private UserService userService;

    @MockBean
    private UserMapper userMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/users/{id} should return user")
    void shouldReturnUser_whenfindUserByIdValid() throws Exception {
        Long userId = 1L;
        User user = new User(userId, "testUser", "password", "role");
        UserDto userDto = new UserDto(userId, "testUser", "role");

        when(userService.findUserById(userId)).thenReturn(user);

        when(userMapper.toDto(user)).thenReturn(userDto);

        mockMvc.perform(get("/api/users/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(userId))
                .andExpect(jsonPath("$.username").value("testUser"));

        verify(userService).findUserById(userId);
    }

    @Test
    @DisplayName("GET /api/users/{id} should return 404")
    void shouldReturn404_whenfindUserByIdInvalid() throws Exception {
        Long invalidId = 999L;

        Mockito.when(userService.findUserById(invalidId)).thenThrow(new UserNotFoundException("User not found with id " + invalidId));


        mockMvc.perform(get("/api/users/{id}", invalidId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/users/add should return UserDto")
    void shouldReturnUserDto_whenSaveUserValid() throws Exception {
        User user = new User(null, "testUser", "password", "role");
        User userSaved = new User(1L, "testUser", "password", "role");
        UserDto userDto = new UserDto(1L, "testUser", "role");

        when(userService.save(any(User.class))).thenReturn(userSaved);
        when(userMapper.toDto(userSaved)).thenReturn(userDto);

        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testUser"))
                .andExpect(jsonPath("$.role").value("role"));
    }

    @Test
    @DisplayName("POST /api/users/add should return 400")
    void shouldReturn400_whenSaveWithInvalidUser() throws Exception {
        User user = new User(null, "", "", "role");


        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/users/add should return 409")
    void shouldReturn409_whenSaveWithUsernameAlreadyExist() throws Exception {
        String existingUsername = "existingUsername";
        User user = new User(null, existingUsername, "test", "role");

        when(userService.save(any(User.class))).thenThrow(new UserNameAlreadyExistException(existingUsername));

        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isConflict())
                .andExpect(content().string("Username " + existingUsername + " already exist, try another one"));
    }

    @Test
    @DisplayName("DELETE /api/tasks/{id} - should delete task by id")
    void shouldDeleteTaskAndReturnNoContent_whenValidIdProvided() throws Exception {
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());

        verify(userService).deleteById(1L);
    }

    @Test
    @DisplayName("DELETE /api/users/{id} - should delete user by id")
    void shouldReturnError_whenDeleteNonExistingTaskById() throws Exception {
        Long userId = 99L;

        doThrow(new UserNotFoundException(userId.toString())).when(userService).deleteById(userId);
        mockMvc.perform(delete("/api/users/99"))
                .andExpect(status().isNotFound());

        verify(userService).deleteById(userId);
    }
}