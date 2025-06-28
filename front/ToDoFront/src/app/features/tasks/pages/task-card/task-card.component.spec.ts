import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { TaskService, Task } from '../../services/task.service';
import { of } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
@Component({
  selector: 'app-task-filter',
  template: ''
})
class MockTaskFilterComponent {
  @Input() selected!: string;
  @Output() filterChanged = new EventEmitter<'all' | 'completed' | 'incomplete'>();
  @Output() addClicked = new EventEmitter<void>();
}

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockTasks: Task[] = [
    { id: 1, label: 'Task 1', description: 'Desc 1', completed: false },
    { id: 2, label: 'Task 2', description: 'Desc 2', completed: true }
  ];

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getTasks', 'updateTaskStatus']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, TaskCardComponent, MockTaskFilterComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    taskServiceMock.getTasks.calls.reset();
    taskServiceMock.updateTaskStatus.calls.reset();
    routerMock.navigate.calls.reset();
  });

  it('should create', () => {
    taskServiceMock.getTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    taskServiceMock.getTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
    expect(taskServiceMock.getTasks).toHaveBeenCalled();
    expect(component.tasks.length).toBe(2);
  });

  it('should filter completed tasks', () => {
    const completedTasks = mockTasks.filter(t => t.completed);
    taskServiceMock.getTasks.and.returnValue(of(completedTasks));

    component.onFilterChange('completed');

    expect(taskServiceMock.getTasks).toHaveBeenCalledWith(true);
    expect(component.tasks).toEqual(completedTasks);
  });

  it('should filter incomplete tasks', () => {
    const incompleteTasks = mockTasks.filter(t => !t.completed);
    taskServiceMock.getTasks.and.returnValue(of(incompleteTasks));

    component.onFilterChange('incomplete');

    expect(taskServiceMock.getTasks).toHaveBeenCalledWith(false);
    expect(component.tasks).toEqual(incompleteTasks);
  });

  it('should toggle task status', () => {
    const task = { ...mockTasks[0] };
    taskServiceMock.updateTaskStatus.and.returnValue(of({ ...task, completed: true }));

    component.toggleCompletedStatus(task);

    expect(taskServiceMock.updateTaskStatus).toHaveBeenCalledWith(task.id!, true);
    expect(task.completed).toBeTrue();
  });

  it('should navigate to task detail on click', () => {
    const task = mockTasks[0];
    component.onTaskClick(task);
    expect(routerMock.navigate).toHaveBeenCalledWith(['tasks', task.id, 'edit'], { queryParams: { from: 'card' } });
  });

  it('should navigate to create task on add click', () => {
    component.onAddTask();
    expect(routerMock.navigate).toHaveBeenCalledWith(['tasks', 'new'], { queryParams: { from: 'card' } });
  });
});
describe('TaskCardComponent DOM', () => {
  let fixture: ComponentFixture<TaskCardComponent>;
  let component: TaskCardComponent;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockTasks: Task[] = [
    { id: 1, label: 'Task 1', description: 'Desc 1', completed: false },
    { id: 2, label: 'Task 2', description: 'Desc 2', completed: true }
  ];

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getTasks', 'updateTaskStatus']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, TaskCardComponent, MockTaskFilterComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    taskServiceMock.getTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
  });

  it('should render the correct number of task cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('.task-card'));
    expect(cards.length).toBe(2);
  });

  it('should display the label and description for each task', () => {
    const cards = fixture.debugElement.queryAll(By.css('.task-card'));
    expect(cards[0].nativeElement.textContent).toContain('Task 1');
    expect(cards[0].nativeElement.textContent).toContain('Desc 1');
    expect(cards[1].nativeElement.textContent).toContain('Task 2');
    expect(cards[1].nativeElement.textContent).toContain('Desc 2');
  });

  it('should apply the correct CSS class for completed and incomplete tasks', () => {
    const cards = fixture.debugElement.queryAll(By.css('.task-card'));
    expect(cards[0].classes['incomplete']).toBeTrue();
    expect(cards[1].classes['completed']).toBeTrue();
  });

  it('should call onTaskClick when a card is clicked', () => {
    spyOn(component, 'onTaskClick');
    const cards = fixture.debugElement.queryAll(By.css('.task-card'));
    cards[0].nativeElement.click();
    expect(component.onTaskClick).toHaveBeenCalledWith(mockTasks[0]);
  });

it('should call toggleCompletedStatus when the button is clicked', () => {
  spyOn(component, 'toggleCompletedStatus');
  taskServiceMock.getTasks.and.returnValue(of(mockTasks));
  fixture.detectChanges();

  const cards = fixture.debugElement.queryAll(By.css('.task-card'));
  const button = cards[0].query(By.css('button'));
  button.nativeElement.click();

  expect(component.toggleCompletedStatus).toHaveBeenCalledWith(mockTasks[0]);
});

  it('should display the correct chip label for completed and incomplete tasks', () => {
    const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
    expect(chips[0].nativeElement.textContent).toContain('En cours');
    expect(chips[1].nativeElement.textContent).toContain('Fait');
  });
});
