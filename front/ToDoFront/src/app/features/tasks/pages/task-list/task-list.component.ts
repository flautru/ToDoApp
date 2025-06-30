import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskFilterComponent } from '../../components/task-filter/task-filter.component';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  statusFilter: 'all' | 'completed' | 'incomplete' = 'all';

  loading = false;
  errorMessage: string | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.onFilterChange();
  }

  onFilterChange(filter?: 'all' | 'completed' | 'incomplete'): void {
    this.loading = true;
    this.taskService.getFilteredTasks(filter).subscribe(
      (tasks) => {
        this.loading = false;
        this.tasks = tasks;
        console.log(tasks == null);
        console.log(!tasks.length);
        if (tasks == null || !tasks.length) {
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
