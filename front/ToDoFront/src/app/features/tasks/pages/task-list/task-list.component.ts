import { Component, OnInit } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { Task, TaskService } from '../../services/task.service';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskFilterComponent } from '../../components/task-filter/task-filter.component';

@Component({
  selector: 'app-task-list',
  imports: [MatListModule, MatIconModule, FormsModule, CommonModule, TaskFilterComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  statusFilter: 'all' | 'completed' | 'incomplete' = 'all';

  constructor(private taskService: TaskService, private router: Router ) {}

  ngOnInit(): void {
    this.onFilterChange();
  }

  onFilterChange(filter?: 'all' | 'completed' | 'incomplete'): void {
    if (filter) {
      this.statusFilter = filter;
    }

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
    this.router.navigate([ 'tasks', task.id, 'edit'], { queryParams: { from: 'list' } });
  }

  onAddTask(): void {
    this.router.navigate(['tasks', 'new'], { queryParams: { from: 'list' } });
  }
}
