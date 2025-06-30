package com.fabien.ToDoApp.controller;

import com.fabien.ToDoApp.dto.TaskCompletionRequestDto;
import com.fabien.ToDoApp.model.Task;
import com.fabien.ToDoApp.service.impl.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tâche", description = "Endpoints lié aux tâches")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(
            summary = "Retourne les taches",
            description = "Retourne une liste de tâche. "
                        + "Si completed=true, retourne uniquement les tâches complétées. "
                        + "Si completed=false, retourne uniquement les tâches incompletées. "
                        + "Si absent retourne toutes les tâches.",
            parameters = {
                    @Parameter(
                            name = "completed",
                            description = "Filtrer par tâches complétées ou non",
                            examples = {
                                    @ExampleObject(name = "Toutes les tâches", value = ""),
                                    @ExampleObject(name = "Tâches complétées", value = "true"),
                                    @ExampleObject(name = "Tâches non complétées", value = "false")
                            }
                    )
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des tâches retournée avec succès")
            })
    public ResponseEntity<List<Task>> getAllTasksOrByCompletionStatus(@RequestParam(required = false) Boolean completed){
        List<Task> tasks;
        if(completed != null){
            tasks = taskService.findTasksByCompletedStatus(completed);
        } else {
            tasks = taskService.findAllTasks();
        }

        if(tasks.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id){
        Task task = taskService.findTaskById(id);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<Task> createTaskById(@RequestBody Task task){
        Task createdTask = taskService.saveTask(task);
        URI location = URI.create("/tasks/" + createdTask.getId());
        return ResponseEntity.
                created(location).
                body(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTaskById(@PathVariable Long id, @RequestBody Task task){
        Task updatedTask = taskService.updateTaskById(id,task);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTaskById(@PathVariable Long id){
        taskService.deleteTaskById(id);
        return ResponseEntity.noContent().build();
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateCompletionStatus(@PathVariable Long id, @RequestBody TaskCompletionRequestDto requestDto){
        Task updatedTask = taskService.updateCompletedStatusTaskById(id, requestDto.isCompleted());

        return ResponseEntity.ok(updatedTask);
    }
}
