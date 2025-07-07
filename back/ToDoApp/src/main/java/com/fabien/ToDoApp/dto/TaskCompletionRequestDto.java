package com.fabien.ToDoApp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class TaskCompletionRequestDto {
    @NotNull(message = "Le statut est obligatoire")
    private boolean completed;
}
