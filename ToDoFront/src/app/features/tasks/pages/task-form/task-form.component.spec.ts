import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTaskById',
      'putTask',
      'postTask',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, ReactiveFormsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => null }),
            queryParams: of({}),
          },
        },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode by default', () => {
    expect(component.isEditMode).toBeFalse();
    expect(component.taskId).toBeUndefined();
  });

  it('should initialize in edit mode if id param is present', fakeAsync(() => {
    const task = {
      id: 1,
      label: 'Test',
      description: 'Desc',
      completed: false,
    };
    taskServiceSpy.getTaskById.and.returnValue(of(task));
    // Simule la présence d'un id dans la route
    (component as any).route.paramMap = of({ get: (key: string) => '1' });
    component.ngOnInit();
    tick();
    expect(component.isEditMode).toBeTrue();
    expect(component.taskId).toBe(1);
    expect(taskServiceSpy.getTaskById).toHaveBeenCalledWith(1);
  }));

  it('should call postTask on submit in create mode', () => {
    component.isEditMode = false;
    component.taskForm.setValue({
      label: 'A',
      description: 'B',
      completed: false,
    });
    taskServiceSpy.postTask.and.returnValue(
      of({ id: 1, label: 'A', description: 'B', completed: false }),
    );
    spyOn(component, 'chooseViewReturn');
    component.onSubmit();
    expect(taskServiceSpy.postTask).toHaveBeenCalled();
    expect(component.chooseViewReturn).toHaveBeenCalled();
  });

  it('should call putTask on submit in edit mode', () => {
    component.isEditMode = true;
    component.taskId = 2;
    component.taskForm.setValue({
      label: 'A',
      description: 'B',
      completed: true,
    });
    taskServiceSpy.putTask.and.returnValue(
      of({ id: 1, label: 'A', description: 'B', completed: false }),
    );
    spyOn(component, 'chooseViewReturn');
    component.onSubmit();
    expect(taskServiceSpy.putTask).toHaveBeenCalledWith(2, jasmine.any(Object));
    expect(component.chooseViewReturn).toHaveBeenCalled();
  });

  it('should not submit if form is invalid', () => {
    component.taskForm.setValue({
      label: '',
      description: '',
      completed: false,
    });
    spyOn(component, 'chooseViewReturn');
    component.onSubmit();
    expect(component.chooseViewReturn).not.toHaveBeenCalled();
  });

  it('should navigate to correct view on cancel (originView=list)', () => {
    component.originView = 'list';
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['tasks/list']);
  });

  it('should navigate to correct view on cancel (originView=card)', () => {
    component.originView = 'card';
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['tasks/card']);
  });
});
