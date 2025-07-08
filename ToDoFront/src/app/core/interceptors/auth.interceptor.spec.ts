import { TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let nextSpy: jasmine.Spy;

  const makeRequest = (headers = {}) =>
    new HttpRequest('GET', '/api/test', {
      headers: new HttpHeaders(headers),
    });

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    nextSpy = jasmine.createSpy('next').and.callFake((req) => req);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });
  });

  it('should add Authorization header if token exists', () => {
    authServiceSpy.getToken.and.returnValue('my-token');
    const req = makeRequest();
    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextSpy);
    });
    const calledReq = nextSpy.calls.mostRecent().args[0];
    expect(calledReq.headers.get('Authorization')).toBe('Bearer my-token');
  });

  it('should not add Authorization header if no token', () => {
    authServiceSpy.getToken.and.returnValue(null);
    const req = makeRequest();
    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextSpy);
    });
    const calledReq = nextSpy.calls.mostRecent().args[0];
    expect(calledReq.headers.has('Authorization')).toBeFalse();
  });

  it('should call next with the request', () => {
    authServiceSpy.getToken.and.returnValue(null);
    const req = makeRequest();
    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextSpy);
    });
    expect(nextSpy).toHaveBeenCalledWith(jasmine.any(HttpRequest));
  });
});
