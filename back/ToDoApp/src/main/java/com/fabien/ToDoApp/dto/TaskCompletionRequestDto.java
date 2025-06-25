package com.fabien.ToDoApp.dto;

import lombok.*;

@Getter
@Setter
@RequiredArgsConstructor
public class TaskCompletionRequestDto {
    private boolean completed;
}
