import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isLoggedIn', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('token', 'abc');
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false if token does not exist', () => {
      localStorage.removeItem('token');
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('getToken', () => {
    it('should return the token if it exists', () => {
      localStorage.setItem('token', 'my-token');
      expect(service.getToken()).toBe('my-token');
    });

    it('should return null if token does not exist', () => {
      localStorage.removeItem('token');
      expect(service.getToken()).toBeNull();
    });
  });

  describe('logout', () => {
    it('should remove the token from localStorage', () => {
      localStorage.setItem('token', 'abc');
      service.logout();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
