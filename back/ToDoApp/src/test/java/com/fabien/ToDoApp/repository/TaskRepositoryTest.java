package com.fabien.ToDoApp.repository;

import com.fabien.ToDoApp.model.Task;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

@DataJpaTest
class TaskRepositoryTest {

    @Autowired
    TaskRepository taskRepository;

    @Test
    @DisplayName("Test findByCompleted(true)")
    void testFindByCompletedTrue() {
        Task task1 = new Task(1L, "Tache 1", "Description 1", true);
        Task task2 = new Task(2L, "Tache 2", "Description 2", false);
        Task task3 = new Task(3L, "Tache 3", "Description 3", true);

        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);

        List<Task> completedTasks = taskRepository.findByCompleted(true);


    }
}