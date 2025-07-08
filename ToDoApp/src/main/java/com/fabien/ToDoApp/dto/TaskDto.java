package com.fabien.ToDoApp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {

    private Long id;
    @NotBlank(message = "Le champ label est obligatoire")
    @Size(max = 50, message = "Le label ne peut depasser les 50 caractères")
    private String label;
    @NotBlank
    @Size(max = 512, message = "La description ne peux depasser les 500 caractère")
    private String description;
    @NotNull(message = "Le champ 'completed' est obligatoire")
    private Boolean completed;
}
