package com.fabien.ToDoApp.service.task;

import com.fabien.ToDoApp.exception.TaskNotFoundException;
import com.fabien.ToDoApp.model.Task;
import com.fabien.ToDoApp.repository.TaskRepository;
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

    public List<Task> findTasksByCompletedStatus(boolean completed) {
        return taskRepository.findByCompleted(completed);
    }

    public Task findTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id.toString()));
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateCompletedStatusTaskById(Long id, boolean status) {
        return taskRepository.findById(id).map(task -> {
            task.setCompleted(status);
            return taskRepository.save(task);
        }).orElseThrow(() -> new TaskNotFoundException(id.toString()));
    }

    public Task updateTaskById(Long id, Task task) {
        return taskRepository.findById(id).map(existingTask -> {
            existingTask.setLabel(task.getLabel());
            existingTask.setDescription(task.getDescription());
            existingTask.setCompleted(task.isCompleted());
            return taskRepository.save(existingTask);
        }).orElseThrow(() -> new TaskNotFoundException(id.toString()));
    }

    public void deleteTaskById(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id.toString()));
        taskRepository.deleteById(id);
    }
}
