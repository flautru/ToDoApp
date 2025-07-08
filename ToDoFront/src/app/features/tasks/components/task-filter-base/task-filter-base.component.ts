import { ErrorHandlerService } from '../../../../core/services/error/error-handler.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
export abstract class TaskFilterBaseComponent {
  tasks: Task[] = [];
  searchTerm: string = '';
  filteredTasks: Task[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(
    protected taskService: TaskService,
    protected errorHandler: ErrorHandlerService,
    private snackBar: MatSnackBar,
  ) {}

  onFilterChange(filter?: 'all' | 'completed' | 'incomplete'): void {
    this.loading = true;
    this.taskService.getFilteredTasks(filter).subscribe({
      next: (tasks) => {
        this.loading = false;
        this.tasks = tasks ?? [];
        this.filterTasks();
        this.errorMessage = this.filteredTasks?.length
          ? ''
          : 'Aucune tâche trouvée.';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = '';
        this.errorHandler.handle(
          err,
          'Erreur lors de la récupération des tâches',
        );
      },
    });
  }

  filterTasks(): void {
    if (!this.tasks) {
      this.filteredTasks = [];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.tasks.filter((task) =>
      task.label.toLowerCase().includes(term),
    );
    this.errorMessage = this.filteredTasks?.length
      ? ''
      : 'Aucune tâche trouvée.';
  }

  toggleCompletedStatus(task: Task): void {
    const newStatus = !task.completed;
    this.taskService.updateTaskStatus(task.id!, newStatus).subscribe({
      next: () => {
        task.completed = newStatus;
      },
      error: (err) => {
        this.errorHandler.handle(err, 'Échec de la mise à jour du statut');
      },
    });
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
        this.filteredTasks = this.filteredTasks.filter(
          (task) => task.id !== id,
        );
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
