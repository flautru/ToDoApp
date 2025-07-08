package com.fabien.ToDoApp.service.user;

import com.fabien.ToDoApp.exception.UserNameAlreadyExistException;
import com.fabien.ToDoApp.exception.UserNotFoundException;
import com.fabien.ToDoApp.mapper.UserMapper;
import com.fabien.ToDoApp.model.User;
import com.fabien.ToDoApp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;
    private UserService userService;
    private UserMapper userMapper;
    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserServiceImpl(userRepository, passwordEncoder);
    }

    @Test
    void givenValidId_whenFindUserById_thenReturnUser() {
        User expectedUser = new User(1L, "UserTest", "1234", "testeur");

        when(userRepository.findById(1L)).thenReturn(Optional.of(expectedUser));
        User user = userService.findUserById(1L);

        assertNotNull(user);
        assertEquals(expectedUser.getId(), user.getId());
        assertEquals(expectedUser.getUsername(), user.getUsername());
        assertEquals(expectedUser.getPassword(), user.getPassword());
        assertEquals(expectedUser.getRole(), user.getRole());
        verify(userRepository).findById(1L);
    }

    @Test
    void givenInvalidId_whenFindUserById_thenReturnUserNotFound() {

        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.findUserById(1L);
        });

        assertEquals("User not found with id: " + 1L, exception.getMessage());
        verify(userRepository).findById(1L);
    }

    @Test
    void givenValidUser_whenSaveUser_thenReturnSaveUser() {
        User expectedUser = new User(1L, "UserTest", "1234", "testeur");

        when(userRepository.findByUsername(expectedUser.getUsername())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(expectedUser);
        User user = userService.save(expectedUser);

        assertNotNull(user);
        assertEquals(expectedUser.getId(), user.getId());
        assertEquals(expectedUser.getUsername(), user.getUsername());
        assertEquals(expectedUser.getPassword(), user.getPassword());
        assertEquals(expectedUser.getRole(), user.getRole());
        verify(userRepository).save(expectedUser);
    }

    @Test
    void givenInvalidUser_whenSaveUser_thenReturnError() {
        User invalidUser = new User(1L, "DejaPris", "1234", "testeur");

        when(userRepository.findByUsername(invalidUser.getUsername())).thenReturn(Optional.of(invalidUser));

        UserNameAlreadyExistException exception = assertThrows(UserNameAlreadyExistException.class, () -> {
            userService.save(invalidUser);
        });

        assertEquals("Username " + invalidUser.getUsername() + " already exist, try another one", exception.getMessage());
        verify(userRepository).findByUsername(invalidUser.getUsername());
        verify(userRepository, never()).save(any());
    }

    @Test
    void givenUserId_whenDeleteByIdUser_thenRepositoryCalled() {
        Long userId = 1L;
        User user = new User(userId, "testUsername", "password", "role");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        userService.deleteById(userId);

        verify(userRepository).deleteById(userId);
    }

    @Test
    void givenInvalidUserId_whenDeleteByIdUser_thenReturnError() {
        Long invalidId = 99L;

        when(userRepository.findById(invalidId)).thenReturn(Optional.empty());
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.deleteById(invalidId);
        });

        assertEquals("User not found with id: " + invalidId, exception.getMessage());
        verify(userRepository, never()).deleteById(any());
    }
}