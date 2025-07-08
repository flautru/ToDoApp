import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserDto } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  postUser(user: User): Observable<UserDto> {
    return this.http.post<User>(`${this.apiUrl}/add`, user);
  }

  getUserById(id: number): Observable<UserDto> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  deleteUserById(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
