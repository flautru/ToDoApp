import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService, Task } from '../../services/task.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockTasks: Task[] = [
    { id: 1, label: 'Tâche 1', description: 'Desc 1', completed: false },
    { id: 2, label: 'Tâche 2', description: 'Desc 2', completed: true },
  ];

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', [
      'updateTaskStatus',
      'getTasks',
      'getFilteredTasks',
      'deleteTask',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    taskServiceMock.getFilteredTasks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    taskServiceMock.getFilteredTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load all tasks by default', () => {
    taskServiceMock.getFilteredTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
    expect(component.tasks.length).toBe(2);
    expect(taskServiceMock.getFilteredTasks).toHaveBeenCalledWith(undefined);
  });

  it('should filter completed tasks', () => {
    const completedTasks = mockTasks.filter((t) => t.completed);
    taskServiceMock.getFilteredTasks.and.returnValue(of(completedTasks));
    component.onFilterChange('completed');
    expect(component.tasks).toEqual(completedTasks);
    expect(taskServiceMock.getFilteredTasks).toHaveBeenCalledWith('completed');
  });

  it('should filter incomplete tasks', () => {
    const incompleteTasks = mockTasks.filter((t) => !t.completed);
    taskServiceMock.getFilteredTasks.and.returnValue(of(incompleteTasks));
    component.onFilterChange('incomplete');
    expect(component.tasks).toEqual(incompleteTasks);
    expect(taskServiceMock.getFilteredTasks).toHaveBeenCalledWith('incomplete');
  });

  it('should handle error when loading tasks', () => {
    spyOn(console, 'error');
    // Simule une erreur dans le service
    taskServiceMock.getFilteredTasks.and.returnValue(of([]));
    component.onFilterChange('completed');
    expect(component.tasks).toEqual([]);
    expect(component.errorMessage).toBe('Aucune tâche trouvée.');
  });

  it('should set errorMessage when getFilteredTasks throws', () => {
    taskServiceMock.getFilteredTasks.and.returnValue(
      throwError(() => new Error('Erreur API'))
    );
    component.onFilterChange('completed');
    expect(component.errorMessage).toBe('');
    expect(component.loading).toBeFalse();
  });

  it('should navigate to edit page on task click', () => {
    const task = mockTasks[0];
    component.onTaskClick(task);
    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['tasks', task.id, 'edit'],
      { queryParams: { from: 'list' } }
    );
  });

  it('should navigate to create page on add click', () => {
    component.onAddTask();
    expect(routerMock.navigate).toHaveBeenCalledWith(['tasks', 'new'], {
      queryParams: { from: 'list' },
    });
  });

  describe('DOM', () => {
    beforeEach(() => {
      taskServiceMock.getFilteredTasks.and.returnValue(of(mockTasks));
      fixture.detectChanges();
    });

    it('should render the correct number of list items', () => {
      const items = fixture.debugElement.queryAll(By.css('.task-item'));
      expect(items.length).toBe(2);
    });

    it('should display the label and status for each task', () => {
      const items = fixture.debugElement.queryAll(By.css('.task-item'));
      expect(items[0].nativeElement.textContent).toContain('Tâche 1');
      expect(items[0].nativeElement.textContent).toContain('En cours');
      expect(items[1].nativeElement.textContent).toContain('Tâche 2');
      expect(items[1].nativeElement.textContent).toContain('Fait');
    });

    it('should apply the correct CSS class for completed and incomplete tasks', () => {
      const items = fixture.debugElement.queryAll(By.css('.task-item'));
      expect(items[0].classes['incomplete']).toBeTrue();
      expect(items[1].classes['completed']).toBeTrue();
    });

    it('should call onTaskClick when a list item is clicked', () => {
      spyOn(component, 'onTaskClick');
      const items = fixture.debugElement.queryAll(
        By.css('.task-item .task-container')
      );
      items[0].nativeElement.click();
      expect(component.onTaskClick).toHaveBeenCalledWith(mockTasks[0]);
    });
    it('should call deleteTask when confirmDelete is confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(component, 'deleteTask');
      const task = mockTasks[0];
      component.confirmDelete(task);
      expect(component.deleteTask).toHaveBeenCalledWith(task.id!);
    });

    it('should not call deleteTask when confirmDelete is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(component, 'deleteTask');
      const task = mockTasks[0];
      component.confirmDelete(task);
      expect(component.deleteTask).not.toHaveBeenCalled();
    });

    it('should remove the task and show snackbar on successful delete', () => {
      // Mock le service et le snackbar
      const snackBar = TestBed.inject(MatSnackBar);
      spyOn(snackBar, 'open');
      taskServiceMock.deleteTask.and.returnValue(of({}));
      component.tasks = [...mockTasks];
      component.deleteTask(mockTasks[0].id!);
      expect(component.tasks.length).toBe(1);
      expect(component.tasks[0].id).toBe(mockTasks[1].id);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Tâche supprimée avec succès',
        'Fermer',
        jasmine.objectContaining({ duration: 3000 })
      );
    });

    it('should show error snackbar on delete error', () => {
      const errorHandler = TestBed.inject(ErrorHandlerService);
      spyOn(console, 'error');
      spyOn(errorHandler, 'handle');
      taskServiceMock.deleteTask.and.returnValue({
        subscribe: (observer: any) => observer.error('Erreur API'),
      } as any);
      component.tasks = [...mockTasks];
      component.deleteTask(mockTasks[0].id!);
      expect(errorHandler.handle).toHaveBeenCalledWith(
        'Erreur API',
        'Échec de la suppression de la tâche'
      );
    });
  });
});
