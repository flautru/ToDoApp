package com.fabien.ToDoApp.controller;

import com.fabien.ToDoApp.dto.TaskCompletionRequestDto;
import com.fabien.ToDoApp.dto.TaskDto;
import com.fabien.ToDoApp.mapper.TaskMapper;
import com.fabien.ToDoApp.model.Task;
import com.fabien.ToDoApp.service.impl.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
    public ResponseEntity<List<TaskDto>> getAllTasksOrByCompletionStatus(@RequestParam(required = false) Boolean completed) {
        List<TaskDto> taskDtos;
        if (completed != null) {
            taskDtos = taskService.findTasksByCompletedStatus(completed).stream().map(TaskMapper::toDto).toList();
        } else {
            taskDtos = taskService.findAllTasks().stream().map(TaskMapper::toDto).toList();
        }

        if (taskDtos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(taskDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id) {
        TaskDto task = TaskMapper.toDto(taskService.findTaskById(id));
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTaskById(@Valid @RequestBody TaskDto taskDto) {
        Task created = taskService.saveTask(TaskMapper.toEntity(taskDto));
        return ResponseEntity
                .created(URI.create("/tasks/" + created.getId()))
                .body(TaskMapper.toDto(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTaskById(@PathVariable Long id, @RequestBody Task task) {
        Task updatedTask = taskService.updateTaskById(id, task);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTaskById(@PathVariable Long id) {
        taskService.deleteTaskById(id);
        return ResponseEntity.noContent().build();
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateCompletionStatus(@PathVariable Long id, @RequestBody TaskCompletionRequestDto requestDto) {
        Task updatedTask = taskService.updateCompletedStatusTaskById(id, requestDto.isCompleted());

        return ResponseEntity.ok(updatedTask);
    }
}
