import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { UsersService } from '../../services/users.service';
import { ErrorHandlerService } from '../../../../core/services/error/error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    usersServiceSpy = jasmine.createSpyObj('UsersService', ['postUser']);
    errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['handle']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserFormComponent, ReactiveFormsModule],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.userForm.setValue({ username: '', password: '', role: '' });
    component.onSubmit();
    expect(usersServiceSpy.postUser).not.toHaveBeenCalled();
  });

  it('should call usersService and show snackbar on success', () => {
    component.userForm.setValue({ username: 'user', password: 'pass', role: 'admin' });
    usersServiceSpy.postUser.and.returnValue(of({ username: 'user', role: 'admin' }));

    component.onSubmit();

    expect(usersServiceSpy.postUser).toHaveBeenCalledWith({ username: 'user', password: 'pass', role: 'admin' });
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Utilisateur créé avec succès',
      'Fermer',
      jasmine.objectContaining({ duration: 5000 })
    );
    expect(component.loading).toBeFalse();
    expect(component.userForm.value).toEqual({ username: null, password: null, role: null });
  });

  it('should call errorHandler on error', () => {
    component.userForm.setValue({ username: 'user', password: 'pass', role: 'admin' });
    usersServiceSpy.postUser.and.returnValue(throwError(() => 'Erreur API'));

    component.onSubmit();

    expect(errorHandlerSpy.handle).toHaveBeenCalledWith('Erreur API', "Erreur lors de la création de l'utilisateur");
    expect(component.loading).toBeFalse();
  });

  it('should reset form and navigate on cancel', () => {
    spyOn(component.userForm, 'reset');
    component.errorMessage = 'test';
    component.loading = true;

    component.onCancel();

    expect(component.userForm.reset).toHaveBeenCalled();
    expect(component.errorMessage).toBeNull();
    expect(component.loading).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
