import { Component, OnInit } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormBuilder,FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule  } from '@angular/material/card';
@Component({
  selector: 'app-task-form',
  imports: [CdkTextareaAutosize, FormsModule,CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {

  taskForm: FormGroup;
  isEditMode: boolean = false;
  taskId?: number;

   task: { label: string; description: string; completed: boolean } = {
    label: '',
    description: '',
    completed: false
  };

  constructor(private fb: FormBuilder, private taskService: TaskService, private route: ActivatedRoute, private router: Router) {
    this.taskForm = this.fb.group({
      label: [''],
      description: [''],
      completed: [false]
    });
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Task ID from route:', id);
      if (id) {
        this.isEditMode = true;
        this.taskId = +id;
        this.taskService.getTaskById(this.taskId).subscribe(task => {
          this.taskForm.patchValue(task);
      });
    }
  });

  // Add methods for form submission, validation, etc.

}
  onSubmit(): void {
    if (this.taskForm.invalid) return;

    const taskData = this.taskForm.value;

    if (this.isEditMode && this.taskId) {
      this.taskService.putTask(this.taskId, taskData).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    } else {
      this.taskService.postTask(taskData).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
