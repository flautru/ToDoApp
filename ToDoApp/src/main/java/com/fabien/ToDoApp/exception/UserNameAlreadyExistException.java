package com.fabien.ToDoApp.exception;

public class UserNameAlreadyExistException extends RuntimeException {
    public UserNameAlreadyExistException(String message) {
        super("Username " + message + " already exist, try another one");
    }
}
