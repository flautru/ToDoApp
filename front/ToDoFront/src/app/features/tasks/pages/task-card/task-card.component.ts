import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Task, TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
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
export class TaskCardComponent implements OnInit {
  tasks: Task[] = [];

  statusFilter: 'all' | 'completed' | 'incomplete' = 'all';
  loading = false;
  errorMessage: string | null = null;
  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

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
        console.error('Erreur lors de la mise à jour :', err);
        this.snackBar.open('Échec de la mise à jour du statut', 'Fermer', {
          duration: 3000,
        });
      },
    });
  }

  onFilterChange(filter?: 'all' | 'completed' | 'incomplete'): void {
    this.loading = true;
    this.taskService.getFilteredTasks(filter).subscribe(
      (tasks) => {
        this.loading = false;
        this.tasks = tasks;
        if (!tasks?.length) {
          this.errorMessage =
            'Aucune tâche trouvée ou une erreur est survenue. Veuillez réessayer plus tard.';
        } else {
          this.errorMessage = '';
        }
      },
      () => {
        this.loading = false;
        this.errorMessage =
          'Une erreur est survenue lors de la récupération des tâches.';
      },
    );
  }

  onTaskClick(task: Task): void {
    console.log('Task clicked:', task);
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
        console.error('Erreur lors de la suppression :', err);
        this.snackBar.open('Échec de la suppression de la tâche', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }
}
