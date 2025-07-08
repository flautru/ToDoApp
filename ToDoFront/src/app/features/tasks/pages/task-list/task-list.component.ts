import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskFilterComponent } from '../../components/task-filter/task-filter.component';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskFilterBaseComponent } from '../../components/task-filter-base/task-filter-base.component';
import { ErrorHandlerService } from '../../../../core/services/error/error-handler.service';
import { Task } from '../../model/task.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-list',
  imports: [
    MatListModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    TaskFilterComponent,
    MatButtonModule,
    MatSpinner,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent
  extends TaskFilterBaseComponent
  implements OnInit
{
  statusFilter: 'all' | 'completed' | 'incomplete' = 'all';

  constructor(
    taskService: TaskService,
    private router: Router,
    private snackBarList: MatSnackBar,
    errorHandler: ErrorHandlerService,
  ) {
    super(taskService, errorHandler, snackBarList);
    this.onFilterChange(this.statusFilter);
  }

  ngOnInit(): void {
    this.onFilterChange();
  }

  onTaskClick(task: Task): void {
    this.router.navigate(['tasks', task.id, 'edit'], {
      queryParams: { from: 'list' },
    });
  }

  onAddTask(): void {
    this.router.navigate(['tasks', 'new'], { queryParams: { from: 'list' } });
  }
}
