import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  username: string;
  password: string;
  role: string;
}

export interface UserDto {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  postUser(user: User): Observable<UserDto> {
    return this.http.post<User>(`${this.apiUrl}/add`, user);
  }

  getUserById(id: number):  Observable<UserDto> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  deleteUserById(id: number): any {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
