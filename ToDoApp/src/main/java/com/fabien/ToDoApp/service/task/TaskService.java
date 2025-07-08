package com.fabien.ToDoApp.service.task;

import com.fabien.ToDoApp.model.Task;

import java.util.List;

public interface TaskService {

    List<Task> findAllTasks();

    List<Task> findTasksByCompletedStatus(boolean completed);

    Task findTaskById(Long id);

    Task saveTask(Task task);

    Task updateTaskById(Long id, Task task);

    Task updateCompletedStatusTaskById(Long id, boolean status);

    void deleteTaskById(Long id);
}
