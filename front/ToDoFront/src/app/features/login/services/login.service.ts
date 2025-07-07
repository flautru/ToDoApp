import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../model/login-request.model';


export interface LoginResponse {
  token: string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    console.log('Login request:', loginRequest);
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest);
  }
}
