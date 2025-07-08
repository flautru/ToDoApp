import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginService, LoginResponse } from '../../services/login.service';
import { ErrorHandlerService } from '../../../../core/services/error/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
    errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['handle']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call errorHandler if form is invalid', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();
    expect(errorHandlerSpy.handle).toHaveBeenCalledWith(
      'Formulaire invalide',
      'Veuillez remplir tous les champs requis.',
    );
  });

  it('should call loginService and navigate on success', () => {
    const response: LoginResponse = { token: 'abc123' };
    component.loginForm.setValue({ username: 'user', password: 'pass' });
    loginServiceSpy.login.and.returnValue(of(response));
    spyOn(localStorage, 'setItem');

    component.onSubmit();

    expect(loginServiceSpy.login).toHaveBeenCalledWith({
      username: 'user',
      password: 'pass',
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks/list']);
  });

  it('should call errorHandler on login error', () => {
    component.loginForm.setValue({ username: 'user', password: 'pass' });
    loginServiceSpy.login.and.returnValue(throwError(() => 'Erreur API'));

    component.onSubmit();

    expect(errorHandlerSpy.handle).toHaveBeenCalledWith(
      'Echec de la connexion',
      'Erreur API',
    );
  });
});
