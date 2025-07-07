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

@Component({
  selector: 'app-task-list',
  imports: [
    MatListModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    TaskFilterComponent,
    MatSpinner,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent extends TaskFilterBaseComponent implements OnInit  {

  statusFilter: 'all' | 'completed' | 'incomplete' = 'all';

  constructor(
    taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar,
    errorHandler: ErrorHandlerService
  ) {
    super(taskService, errorHandler);
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

  confirmDelete(task: Task): void {
    if (
      confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.label}" ?`)
    ) {
      this.deleteTask(task.id!);
    }
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        this.snackBar.open('Tâche supprimée avec succès', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        this.errorHandler.handle(err, 'Échec de la suppression de la tâche');
      },
    });
  }
}
