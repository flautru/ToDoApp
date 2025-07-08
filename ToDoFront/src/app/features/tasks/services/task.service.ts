import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Task } from '../model/task.model';


export interface TaskCompletionRequestDto {
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(completed?: boolean): Observable<Task[]> {
    let params = new HttpParams();
    if (completed !== undefined) {
      params = params.set('completed', completed.toString());
    }
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  getFilteredTasks(statusFilter?: string): Observable<Task[]> {
    let completed: boolean | undefined;

    if (statusFilter === 'completed') {
      completed = true;
    } else if (statusFilter === 'incomplete') {
      completed = false;
    }

    return this.getTasks(completed).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des tâches', error);
        return of([]);
      })
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  postTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  putTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  updateTaskStatus(id: number, status: boolean): Observable<Task> {
    const url = `${this.apiUrl}/${id}/status`;
    const body: TaskCompletionRequestDto = { completed: status };

    return this.http.patch<Task>(url, body);
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
