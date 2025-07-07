package com.fabien.ToDoApp.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super("User not found with id: " + message);
    }
}
