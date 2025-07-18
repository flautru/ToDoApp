import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { ErrorHandlerService } from '../../../../core/services/error/error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
@Component({
  selector: 'app-user-form',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSpinner,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatError,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private errorHandler: ErrorHandlerService,
    private snackBar: MatSnackBar,
    private route: Router,
  ) {
    this.userForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', [Validators.required]],
        confirmPassword: ['', Validators.required],
        role: [''],
      },
      {
        validators: passwordMatchValidator,
      },
    );
  }

  ngOnInit() {}

  onSubmit(): void {
    if (this.userForm.invalid) return;
    this.loading = true;
    this.errorMessage = null;
    const { username, password, role } = this.userForm.value;
    const userToSend = { username, password, role };

    this.userService.postUser(userToSend).subscribe({
      next: (user) => {
        this.loading = false;
        this.userForm.reset();
        this.snackBar.open('Utilisateur créé avec succès', 'Fermer', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
      error: (error) => {
        this.errorHandler.handle(
          error,
          "Erreur lors de la création de l'utilisateur",
        );
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.userForm.reset();
    this.errorMessage = null;
    this.loading = false;
    this.route.navigate(['/login']);
  }
}
