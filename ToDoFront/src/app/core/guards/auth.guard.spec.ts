import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth/auth.service';

describe('AuthGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => AuthGuard(...guardParameters));

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow access if user is logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeTrue();
  });

  it('should redirect to login if user is not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    const fakeTree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(fakeTree);
    const result = executeGuard({} as any, {} as any);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(fakeTree);
  });
});
