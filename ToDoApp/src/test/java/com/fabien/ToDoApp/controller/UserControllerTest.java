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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

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
    @DisplayName("GET /api/users?page=0&size=2 should return paginated users")
    void givenPageRequest_whenFindAllUsers_thenReturnUserPage() throws Exception {

        User user1 = new User(1L, "testUser1", "1234", "user");
        User user2 = new User(2L, "testUser2", "5678", "admin");
        UserDto userDto1 = new UserDto(1L, "testUser1", "user");
        UserDto userDto2 = new UserDto(2L, "testUser2", "admin");

        Page<User> userPage = new PageImpl<>(List.of(user1, user2));

        when(userService.findAllUsers(any(Pageable.class))).thenReturn(userPage);
        when(userMapper.toDto(user1)).thenReturn(userDto1);
        when(userMapper.toDto(user2)).thenReturn(userDto2);
        Page<UserDto> userDtos = userPage.map(userMapper::toDto);

        mockMvc.perform(get("/api/users")
                        .param("page", "0")
                        .param("size", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].username").value(userDtos.getContent().get(0).getUsername()))
                .andExpect(jsonPath("$.content[1].username").value(userDtos.getContent().get(1).getUsername()))
                .andExpect(jsonPath("$.content[0].role").value(userDtos.getContent().get(0).getRole()))
                .andExpect(jsonPath("$.content[1].role").value(userDtos.getContent().get(1).getRole()));
    }

    @Test
    @DisplayName("GET /api/users?page=0&size=2 should return empty page when no users")
    void givenNoUsers_whenFindAllUsers_thenReturnEmptyPage() throws Exception {
        Page<User> emptyPage = Page.empty();

        when(userService.findAllUsers(any(Pageable.class))).thenReturn(emptyPage);

        mockMvc.perform(get("/api/users")
                        .param("page", "0")
                        .param("size", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());
    }

    @Test
    @DisplayName("GET /api/users/{id} should return userDto when existing id")
    void givenValidUserId_whenFindUserById_thenReturnUserDto() throws Exception {
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
    @DisplayName("GET /api/users/{id} should return 404 when no found id")
    void givenNoValidUserId_whenFindUserById_thenReturn404() throws Exception {
        Long invalidId = 999L;

        Mockito.when(userService.findUserById(invalidId)).thenThrow(new UserNotFoundException("User not found with id " + invalidId));

        mockMvc.perform(get("/api/users/{id}", invalidId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/users/add should return UserDto when valid User")
    void givenValidUser_whenSave_thenReturnUserDto() throws Exception {
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
    @DisplayName("POST /api/users/add should return 400 when bad User")
    void givenNoValidUser_whenSave_thenReturn400() throws Exception {
        User user = new User(null, "", "", "role");

        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/users/add should return 409 when username already exist")
    void givenExistingUser_whenSave_thenReturn409() throws Exception {
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
    @DisplayName("DELETE /api/users/{id} - should delete user by id when existing id")
    void givenExistingUserId_whenDeleteById_thenReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());

        verify(userService).deleteById(1L);
    }

    @Test
    @DisplayName("DELETE /api/users/{id} - should throw userNotFound when no existing id")
    void givenNonExistingUserId_whenDeleteById_thenReturnUserNotFound() throws Exception {
        Long userId = 99L;

        doThrow(new UserNotFoundException(userId.toString())).when(userService).deleteById(userId);
        mockMvc.perform(delete("/api/users/99"))
                .andExpect(status().isNotFound());

        verify(userService).deleteById(userId);
    }
}