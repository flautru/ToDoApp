package com.fabien.ToDoApp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Le username est obligatoire")
    @Column(nullable = false, unique = true)
    private String username;
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Column(nullable = false)
    private String password;
    private String role;

}
