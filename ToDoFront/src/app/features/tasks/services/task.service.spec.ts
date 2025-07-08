import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockTasks: Task[] = [
    { id: 1, label: 'Tâche 1', description: 'Desc 1', completed: false },
    { id: 2, label: 'Tâche 2', description: 'Desc 2', completed: true },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tasks (without filter)', () => {
    service.getTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should fetch completed tasks', () => {
    service.getTasks(true).subscribe();

    const req = httpMock.expectOne(
      (r) =>
        r.url === 'http://localhost:8080/api/tasks' &&
        r.params.get('completed') === 'true',
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch task by ID', () => {
    service.getTaskById(1).subscribe((task) => {
      expect(task).toEqual(mockTasks[0]);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks[0]);
  });

  it('should post a new task', () => {
    const newTask: Task = {
      label: 'Nouvelle tâche',
      description: '',
      completed: false,
    };

    service.postTask(newTask).subscribe((task) => {
      expect(task).toEqual({ ...newTask, id: 3 });
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks');
    expect(req.request.method).toBe('POST');
    req.flush({ ...newTask, id: 3 });
  });

  it('should update a task', () => {
    const updatedTask = { ...mockTasks[0], label: 'Updated' };

    service.putTask(1, updatedTask).subscribe((task) => {
      expect(task.label).toBe('Updated');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTask);
  });

  it('should update task status', () => {
    service.updateTaskStatus(1, true).subscribe((task) => {
      expect(task.completed).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1/status');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ completed: true });
    req.flush({ ...mockTasks[0], completed: true });
  });

  it('should delete a task', () => {
    service.deleteTask(1).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should filter tasks with getFilteredTasks (completed)', () => {
    service.getFilteredTasks('completed').subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === 'http://localhost:8080/api/tasks' &&
        r.params.get('completed') === 'true',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should filter tasks with getFilteredTasks (incomplete)', () => {
    service.getFilteredTasks('incomplete').subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === 'http://localhost:8080/api/tasks' &&
        r.params.get('completed') === 'false',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should filter tasks with getFilteredTasks (all)', () => {
    service.getFilteredTasks('all').subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should handle error in getFilteredTasks and return []', () => {
    spyOn(console, 'error');
    service.getFilteredTasks('completed').subscribe((tasks) => {
      expect(tasks).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === 'http://localhost:8080/api/tasks' &&
        r.params.get('completed') === 'true',
    );
    req.flush('Erreur serveur', { status: 500, statusText: 'Server Error' });
  });
});
