package com.fabien.ToDoApp.service.task;

import com.fabien.ToDoApp.exception.TaskNotFoundException;
import com.fabien.ToDoApp.model.Task;
import com.fabien.ToDoApp.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceImplTest {

    private TaskRepository taskRepository;
    private TaskServiceImpl taskService;

    @BeforeEach
    void setUp() {
        taskRepository = mock(TaskRepository.class);
        taskService = new TaskServiceImpl(taskRepository);
    }

    @Test
    void givenValidTasks_whenFindAllTask_thenReturnAllTask() {
        Task task1 = new Task(1L, "Task 1", "Desc 1", false);
        Task task2 = new Task(2L, "Task 2", "Desc 2", true);

        when(taskRepository.findAll()).thenReturn(List.of(task1, task2));

        List<Task> tasks = taskService.findAllTasks();
        assertEquals(2, tasks.size());
        verify(taskRepository).findAll();
    }

    @Test
    void givenCompletedFalse_whenFindTaskByIncompleteTasks_thenReturnCompletedTasks() {
        Task task1 = new Task(1L, "Task 1", "Desc 1", false);

        when(taskRepository.findByCompleted(false)).thenReturn(List.of(task1));
        List<Task> tasks = taskService.findTasksByCompletedStatus(false);

        assertEquals(1, tasks.size());
        verify(taskRepository).findByCompleted(false);
    }

    @Test
    void givenCompletedTrue_whenFindTasksByCompletedTask_thenReturnIncompletedTasks() {
        Task task = new Task(2L, "Task 2", "Desc 2", true);

        when(taskRepository.findByCompleted(true)).thenReturn(List.of(task));
        List<Task> tasks = taskService.findTasksByCompletedStatus(true);

        assertEquals(1, tasks.size());
        verify(taskRepository).findByCompleted(true);
    }

    @Test
    void givenExistingId_whenFindById_thenReturnTask() {
        Task expectedTask = new Task(5L, "Task 2", "Desc 2", true);

        when(taskRepository.findById(5L)).thenReturn(Optional.of(expectedTask));
        Task task = taskService.findTaskById(5L);

        assertNotNull(task);
        assertEquals(expectedTask.getId(), task.getId());
        assertEquals(expectedTask.getLabel(), task.getLabel());
        assertEquals(expectedTask.getDescription(), task.getDescription());
        assertEquals(expectedTask.isCompleted(), task.isCompleted());
        verify(taskRepository).findById(5L);
    }

    @Test
    void givenNonExistingId_whenFindById_thenThrowTaskNotFoundException() {

        when(taskRepository.findById(5L)).thenReturn(Optional.empty());
        TaskNotFoundException exception = assertThrows(TaskNotFoundException.class, () -> {
            taskService.findTaskById(5L);
        });

        assertEquals("Task not found with id : " + 5L, exception.getMessage());
        verify(taskRepository).findById(5L);
    }

    @Test
    void givenValidTask_whenSaveTask_thenReturnSavedTask() {
        Task expectedTask = new Task(2L, "Task 2", "Desc 2", true);

        when(taskRepository.save(any(Task.class))).thenReturn(expectedTask);
        Task task = taskService.saveTask(expectedTask);

        assertNotNull(task);
        assertEquals(expectedTask.getId(), task.getId());
        assertEquals(expectedTask.getLabel(), task.getLabel());
        assertEquals(expectedTask.getDescription(), task.getDescription());
        assertEquals(expectedTask.isCompleted(), task.isCompleted());
        verify(taskRepository).save(expectedTask);
    }

    @Test
    void givenExistingId_whenUpdateCompletedStatusTaskById_thenStatusIsUpdated() {
        Long taskId = 1L;
        boolean newStatus = true;
        Task existingTask = new Task(taskId, "Label", "Description", false);
        Task updatedTask = new Task(taskId, "Label", "Description", newStatus);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenReturn(updatedTask);
        Task result = taskService.updateCompletedStatusTaskById(taskId, newStatus);

        assertNotNull(result);
        assertEquals(newStatus, result.isCompleted());
        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, times(1)).save(existingTask);
    }

    @Test
    void givenNoExistingId_whenUpdateCompletedTaskById_thenThrowStatusTaskNotFoundException() {
        Long taskId = 99L;
        boolean newStatus = true;

        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());
        TaskNotFoundException exception = assertThrows(TaskNotFoundException.class, () -> {
            taskService.updateCompletedStatusTaskById(taskId, newStatus);
        });

        assertEquals("Task not found with id : " + taskId, exception.getMessage());
        verify(taskRepository).findById(taskId);
        verify(taskRepository, never()).save(any());
    }

    @Test
    void givenExistingId_whenUpdateTaskById_thenReturnUpdatedTask() {
        Task existingTask = new Task(1L, "Label", "Description", false);
        Task updatedTask = new Task(1L, "Label 2", "Description 2", false);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenReturn(updatedTask);
        Task result = taskService.updateTaskById(1L, updatedTask);

        assertNotNull(result);
        assertEquals(updatedTask.getId(), result.getId());
        assertEquals(updatedTask.getLabel(), result.getLabel());
        assertEquals(updatedTask.getDescription(), result.getDescription());
        assertEquals(updatedTask.isCompleted(), result.isCompleted());
        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).save(updatedTask);
    }

    @Test
    void givenNoExistingId_whenUpdateTaskById_thenThrowStatusTaskNotFoundException() {
        Long taskId = 99L;
        Task updatedTask = new Task(taskId, "Label 2", "Description 2", false);

        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());
        TaskNotFoundException exception = assertThrows(TaskNotFoundException.class, () -> {
            taskService.updateTaskById(taskId, updatedTask);
        });

        assertEquals("Task not found with id : " + taskId, exception.getMessage());
        verify(taskRepository).findById(taskId);
        verify(taskRepository, never()).save(any());
    }
}