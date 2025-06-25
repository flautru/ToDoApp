package com.fabien.ToDoApp.service.impl;

import com.fabien.ToDoApp.model.Task;

import java.util.List;

public interface TaskService {

    List<Task> findAllTasks();
    List<Task> findIncompleteTasks(boolean completed);
    Task findTaskById(Long id);
    Task saveTask(Task task);
    Task updateTask(Long id,Task task);
    Task updateCompletedTaskById(Long id, boolean status);
    void deleteTaskById(Long id);

}
