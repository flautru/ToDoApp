import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserDto } from '../models/user.model';
import { Page } from '../../../core/models/page.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUsers(page: number = 0, size: number = 10): Observable<Page<UserDto>> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<Page<User>>(this.apiUrl, { params });
  }

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
