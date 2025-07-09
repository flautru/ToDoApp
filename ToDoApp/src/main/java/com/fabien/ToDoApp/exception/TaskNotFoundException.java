package com.fabien.ToDoApp.exception;

public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException(String message) {
        super("Task not found with id : " + message);
    }
}
