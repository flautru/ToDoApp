import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  handle(error: any, message?: string): void {
    console.error('Une erreur est détéctée:', error);

    let errorMessage =
      message ?? 'Une erreur est survenue. Veuillez réessayer plus tard.';

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errorMessage =
          'Le serveur est inaccessible. Veuillez vérifier votre connexion Internet.';
      } else if (error.status >= 500) {
        errorMessage = 'Une erreur interne du serveur est survenue.';
      } else if (error.status === 404) {
        errorMessage = 'Ressource non trouvée.';
      } else if (error.status >= 400) {
        errorMessage = 'Une erreur de requête a été détectée.';
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (message) {
      errorMessage = message;
    }

    this.snackBar.open(errorMessage, 'Fermer', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
