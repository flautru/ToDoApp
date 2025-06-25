package com.fabien.ToDoApp.service.impl;

import com.fabien.ToDoApp.exception.TaskNotFoundException;
import com.fabien.ToDoApp.model.Task;
import com.fabien.ToDoApp.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    public List<Task> findAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> findIncompleteTasks(boolean completed) {
        return taskRepository.findByCompleted(completed);
    }

    public Task findTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException("Task not found with id : " + id));
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateCompletedTaskById(Long id, boolean status) {
        return taskRepository.findById(id).
                map( task -> {
                    task.setCompleted(status);
                    return taskRepository.save(task);
                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id : " + id));
    }

    public Task updateTask(Long id, Task task) {
        return taskRepository.findById(id).
                map( existingTask -> {
                    existingTask.setLabel(task.getLabel());
                    existingTask.setDescription(task.getDescription());
                    existingTask.setCompleted(task.isCompleted());
                    return taskRepository.save(existingTask);
                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id : " + id));
    }

    public void deleteTaskById(Long id) {
        Task task  = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException("Task not found with id : " + id));
        taskRepository.delete(task);
    }
}
