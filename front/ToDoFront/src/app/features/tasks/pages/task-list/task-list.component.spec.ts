import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService, Task } from '../../services/task.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockTasks: Task[] = [
    { id: 1, label: 'Tâche 1', description: 'Desc 1', completed: false },
    { id: 2, label: 'Tâche 2', description: 'Desc 2', completed: true }
  ];

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getTasks']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    taskServiceMock.getTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load all tasks by default', () => {
    taskServiceMock.getTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
    expect(component.tasks.length).toBe(2);
    expect(taskServiceMock.getTasks).toHaveBeenCalledWith();
  });

  it('should filter completed tasks', () => {
    const completedTasks = mockTasks.filter(t => t.completed);
    taskServiceMock.getTasks.and.returnValue(of(completedTasks));
    component.onFilterChange('completed');
    expect(component.tasks).toEqual(completedTasks);
    expect(taskServiceMock.getTasks).toHaveBeenCalledWith(true);
  });

  it('should filter incomplete tasks', () => {
    const incompleteTasks = mockTasks.filter(t => !t.completed);
    taskServiceMock.getTasks.and.returnValue(of(incompleteTasks));
    component.onFilterChange('incomplete');
    expect(component.tasks).toEqual(incompleteTasks);
    expect(taskServiceMock.getTasks).toHaveBeenCalledWith(false);
  });

  it('should navigate to edit page on task click', () => {
    const task = mockTasks[0];
    component.onTaskClick(task);
    expect(routerMock.navigate).toHaveBeenCalledWith(['tasks', task.id, 'edit'], { queryParams: { from: 'list' } });
  });

  it('should navigate to create page on add click', () => {
    component.onAddTask();
    expect(routerMock.navigate).toHaveBeenCalledWith(['tasks', 'new'], { queryParams: { from: 'list' } });
  });

  describe('DOM', () => {
    beforeEach(() => {
      taskServiceMock.getTasks.and.returnValue(of(mockTasks));
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
      const items = fixture.debugElement.queryAll(By.css('.task-item'));
      items[0].nativeElement.click();
      expect(component.onTaskClick).toHaveBeenCalledWith(mockTasks[0]);
    });
  });
});
