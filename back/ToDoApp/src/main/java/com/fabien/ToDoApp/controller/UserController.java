package com.fabien.ToDoApp.controller;

import com.fabien.ToDoApp.dto.UserDto;
import com.fabien.ToDoApp.mapper.UserMapper;
import com.fabien.ToDoApp.model.User;
import com.fabien.ToDoApp.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        User user = userService.findUserById(id);
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @PostMapping("/add")
    public ResponseEntity<UserDto> save(@Valid @RequestBody User user) {
        User createdUser = userService.save(user);
        return ResponseEntity.created(URI.create("/users/" + createdUser.getId())).body(userMapper.toDto(createdUser));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
