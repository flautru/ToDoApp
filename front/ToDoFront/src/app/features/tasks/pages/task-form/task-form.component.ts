import { Component, OnInit } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-task-form',
  imports: [
    MatSpinner,
    CdkTextareaAutosize,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode: boolean = false;
  taskId?: number;
  originView: string = 'list';

  loading: boolean = false;
  errorMessage: string | null = null;

  task: { label: string; description: string; completed: boolean } = {
    label: '',
    description: '',
    completed: false,
  };

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.taskForm = this.fb.group({
      label: [''],
      description: [''],
      completed: [false],
    });
  }

  ngOnInit(): void {
    console.log('TaskFormComponent initialized');

    this.route.queryParams.subscribe((params) => {
      this.originView = params['from'] || 'list';
    });
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('Task ID from route:', id);
      if (id) {
        this.isEditMode = true;
        this.taskId = +id;
        this.taskService.getTaskById(this.taskId).subscribe((task) => {
          this.taskForm.patchValue(task);
        });
      }
    });
  }
  onSubmit(): void {
    if (this.taskForm.invalid) return;
    this.loading = true;
    this.errorMessage = null;

    const taskData = this.taskForm.value;

    if (this.isEditMode && this.taskId) {
      this.taskService.putTask(this.taskId, taskData).subscribe(
        (task) => {
          this.loading = false;
          this.chooseViewReturn();
        },
        (err) => {
          this.loading = false;
          this.errorMessage =
            'Une erreur est survenue lors de la mise à jour de la tâche.';
          console.error('Error updating task:', err);
        },
      );
    } else {
      this.taskService.postTask(taskData).subscribe(
        (task) => {
          this.loading = false;
          this.chooseViewReturn();
        },
        (err) => {
          this.loading = false;
          this.errorMessage =
            'Une erreur est survenue lors de la mise à jour de la tâche.';
          console.error('Error updating task:', err);
        },
      );
    }
  }

  onCancel(): void {
    this.chooseViewReturn();
  }

  chooseViewReturn(): void {
    if (this.originView === 'card') {
      this.router.navigate(['tasks/card']);
    } else {
      this.router.navigate(['tasks/list']);
    }
  }
}
