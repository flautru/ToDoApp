import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlerService } from '../../../../core/services/error/error-handler.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatButton,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private route: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorHandler.handle(
        'Formulaire invalide',
        'Veuillez remplir tous les champs requis.',
      );
      return;
    }
    const loginRequest = this.loginForm.value;
    this.loginService.login(loginRequest).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        console.log('Token:', response.token);
        localStorage.setItem('token', response.token);
        this.route.navigate(['/tasks/list']);
      },
      error: (error) => {
        this.errorHandler.handle('Echec de la connexion', error);
        this.loginError = 'Username ou mot de passe incorrect';
      },
    });
  }
}
