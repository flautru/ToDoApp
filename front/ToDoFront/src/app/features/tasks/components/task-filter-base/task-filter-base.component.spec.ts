import { of, throwError } from 'rxjs';
import { Task, TaskService } from '../../services/task.service';
import { ErrorHandlerService } from '../../../../core/services/error/error-handler.service';
import { TaskFilterBaseComponent } from './task-filter-base.component';

class TestComponent extends TaskFilterBaseComponent {
  constructor(taskService: TaskService, errorHandler: ErrorHandlerService) {
    super(taskService, errorHandler);
  }
}

describe('TaskFilterBaseComponent', () => {
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let errorHandlerMock: jasmine.SpyObj<ErrorHandlerService>;
  let component: TestComponent;

  const mockTasks: Task[] = [
    { id: 1, label: 'Tâche 1', description: 'Desc 1', completed: false },
    { id: 2, label: 'Tâche 2', description: 'Desc 2', completed: true },
  ];

  beforeEach(() => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getFilteredTasks']);
    errorHandlerMock = jasmine.createSpyObj('ErrorHandlerService', ['handle']);
    component = new TestComponent(taskServiceMock, errorHandlerMock);
  });

  it('should set tasks and clear errorMessage on success', () => {
    taskServiceMock.getFilteredTasks.and.returnValue(of(mockTasks));
    component.onFilterChange('completed');
    expect(component.loading).toBeFalse();
    expect(component.tasks).toEqual(mockTasks);
    expect(component.errorMessage).toBe('');
  });

  it('should set errorMessage if no tasks found', () => {
    taskServiceMock.getFilteredTasks.and.returnValue(of([]));
    component.onFilterChange('completed');
    expect(component.loading).toBeFalse();
    expect(component.tasks).toEqual([]);
    expect(component.errorMessage).toBe('Aucune tâche trouvée.');
  });

  it('should handle error and set errorMessage on error', () => {
    taskServiceMock.getFilteredTasks.and.returnValue(throwError(() => new Error('Erreur API')));
    component.onFilterChange('completed');
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('');
    expect(errorHandlerMock.handle).toHaveBeenCalledWith(jasmine.any(Error), 'Erreur lors de la récupération des tâches');
  });
});
