import { Component, OnInit } from '@angular/core';
import { Task, TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  standalone: true
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  completedTasks: Task[] = [];
  pendingTasks: Task[] = [];
  showCompleted: boolean = true;
  showPending: boolean = true;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  markTaskAsIncomplete(id: number): void {
  this.taskService.updateTaskStatus(id, false).subscribe(() => {
      this.loadTasks();
    });
  }
  markTaskAsCompleted(id: number): void {
    this.taskService.updateTaskStatus(id, true).subscribe(() => {
      this.loadTasks();
    });
  }

}
