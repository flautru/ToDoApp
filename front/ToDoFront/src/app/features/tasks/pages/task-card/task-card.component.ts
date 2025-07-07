import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Task } from '../../model/task.model';
import {
  MatCardActions,
  MatCardTitle,
  MatCardContent,
  MatCardModule,
} from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { TaskFilterComponent } from '../../components/task-filter/task-filter.component';
import { MatSpinner } from '@angular/material/progress-spinner';
import { TaskFilterBaseComponent } from '../../components/task-filter-base/task-filter-base.component';
import { ErrorHandlerService } from '../../../../core/services/error/error-handler.service';

@Component({
  selector: 'app-task-card',
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    MatCardActions,
    MatCardModule,
    MatCardTitle,
    MatChipsModule,
    MatCardContent,
    TaskFilterComponent,
    MatSpinner,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
  standalone: true,
})
export class TaskCardComponent extends TaskFilterBaseComponent implements OnInit {
  statusFilter: 'all' | 'completed' | 'incomplete' = 'all';

  constructor(
    taskService: TaskService,
    private snackBar: MatSnackBar,
    private router: Router,
    errorHandler: ErrorHandlerService
  ) {
    super(taskService, errorHandler);
    this.onFilterChange(this.statusFilter);
  }

  ngOnInit(): void {
    this.onFilterChange(this.statusFilter);
  }

  toggleCompletedStatus(task: Task): void {
    const newStatus = !task.completed;
    this.taskService.updateTaskStatus(task.id!, newStatus).subscribe({
      next: () => {
        task.completed = newStatus;
      },
      error: (err) => {
        this.errorHandler.handle(err,'Échec de la mise à jour du statut')
      },
    });
  }

  onTaskClick(task: Task): void {
    this.router.navigate(['tasks', task.id, 'edit'], {
      queryParams: { from: 'card' },
    });
  }

  onAddTask(): void {
    this.router.navigate(['tasks', 'new'], { queryParams: { from: 'card' } });
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

  onValidateSearch(term: string): void {
    this.searchTerm = term;
    this.filterTasks();
  }

}
