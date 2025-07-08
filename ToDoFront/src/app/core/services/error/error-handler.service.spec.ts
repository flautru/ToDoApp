import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from './error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show default message for generic error', () => {
    service.handle({});
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Une erreur est survenue. Veuillez réessayer plus tard.',
      'Fermer',
      jasmine.objectContaining({ duration: 5000 }),
    );
  });

  it('should show custom message if provided', () => {
    service.handle({}, 'Custom message');
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Custom message',
      'Fermer',
      jasmine.objectContaining({ duration: 5000 }),
    );
  });

  it('should show server inaccessible message for status 0', () => {
    const error = new HttpErrorResponse({ status: 0 });
    service.handle(error);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Le serveur est inaccessible. Veuillez vérifier votre connexion Internet.',
      'Fermer',
      jasmine.objectContaining({ duration: 5000 }),
    );
  });

  it('should show internal server error message for status >= 500', () => {
    const error = new HttpErrorResponse({ status: 500 });
    service.handle(error);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Une erreur interne du serveur est survenue.',
      'Fermer',
      jasmine.objectContaining({ duration: 5000 }),
    );
  });

  it('should show not found message for status 404', () => {
    const error = new HttpErrorResponse({ status: 404 });
    service.handle(error);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Ressource non trouvée.',
      'Fermer',
      jasmine.objectContaining({ duration: 5000 }),
    );
  });

  it('should show request error message for status >= 400', () => {
    const error = new HttpErrorResponse({ status: 400 });
    service.handle(error);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Une erreur de requête a été détectée.',
      'Fermer',
      jasmine.objectContaining({ duration: 5000 }),
    );
  });

  it('should show string error as message', () => {
    service.handle('Erreur API');
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Erreur API',
      'Fermer',
      jasmine.objectContaining({ duration: 5000 }),
    );
  });
});
