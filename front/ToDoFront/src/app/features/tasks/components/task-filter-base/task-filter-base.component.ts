import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { Task, TaskService } from '../../services/task.service';

export abstract class TaskFilterBaseComponent {
  tasks: Task[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(protected taskService: TaskService, protected errorHandler: ErrorHandlerService) {}

  onFilterChange(filter?: 'all' | 'completed' | 'incomplete'): void {
    this.loading = true;
    this.taskService.getFilteredTasks(filter).subscribe({
      next: (tasks) => {
        this.loading = false;
        this.tasks = tasks;
        this.errorMessage = tasks?.length ? '' : 'Aucune tâche trouvée.';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage ='';
        this.errorHandler.handle(err, 'Erreur lors de la récupération des tâches');
      }
    });
  }
}
