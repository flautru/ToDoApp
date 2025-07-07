import { ErrorHandlerService } from '../../../../core/services/error/error-handler.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../model/task.model';
export abstract class TaskFilterBaseComponent {
  tasks: Task[] = [];
  searchTerm: string = '';
  filteredTasks : Task[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(protected taskService: TaskService, protected errorHandler: ErrorHandlerService) {}

  onFilterChange(filter?: 'all' | 'completed' | 'incomplete'): void {
    this.loading = true;
    this.taskService.getFilteredTasks(filter).subscribe({
      next: (tasks) => {
        this.loading = false;
        this.tasks = tasks ?? [];
        this.filterTasks();
        this.errorMessage = this.filteredTasks?.length ? '' : 'Aucune tâche trouvée.';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage ='';
        this.errorHandler.handle(err, 'Erreur lors de la récupération des tâches');
      }
    });

  }

filterTasks(): void {
  if (!this.tasks) {
    this.filteredTasks = [];
    return;
  }
  const term = this.searchTerm.toLowerCase();
  this.filteredTasks = this.tasks.filter((task) =>
    task.label.toLowerCase().includes(term)
  );
  this.errorMessage = this.filteredTasks?.length ? '' : 'Aucune tâche trouvée.';
}
}
