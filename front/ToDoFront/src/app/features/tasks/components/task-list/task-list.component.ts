import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Task, TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { MatCardActions, MatCardTitle, MatCardContent,MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-task-list',
  imports: [FormsModule,CommonModule,MatTableModule, MatButtonToggleModule,MatButtonModule, MatIconModule, MatCardActions,MatCardModule , MatCardTitle, MatChipsModule,MatCardContent],
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

  statusFilter: 'all' | 'completed' | 'incomplete' = 'all';

  constructor(private taskService: TaskService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.onFilterChange();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      console.log('Tasks fetched from service:', tasks);
      this.tasks = tasks;
    });
  }

  toggleCompletedStatus(task: Task): void {
  const newStatus = !task.completed;
  this.taskService.updateTaskStatus(task.id!, newStatus).subscribe({
     next: () => {
      task.completed = newStatus;
    },
    error: (err) => {
      console.error("Erreur lors de la mise à jour :", err);
      this.snackBar.open("Échec de la mise à jour du statut", "Fermer", { duration: 3000 });
    }
  });
  }

  onFilterChange(): void {
    if (this.statusFilter === 'completed') {
      this.taskService.getTasks(true).subscribe(tasks => this.tasks = tasks);
    } else if (this.statusFilter === 'incomplete') {
      this.taskService.getTasks(false).subscribe(tasks => this.tasks = tasks);
    } else {
      this.taskService.getTasks().subscribe(tasks => this.tasks = tasks);
    }
  }

  onTaskClick(task: Task): void {
    console.log('Task clicked:', task);
    this.router.navigate([ 'tasks', task.id, 'edit']);
  }
}


