import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-task-filter',
  imports: [CommonModule, FormsModule, MatButtonToggleModule],
  templateUrl: './task-filter.component.html',
  styleUrl: './task-filter.component.css',
})
export class TaskFilterComponent {
  @Input() selected: 'all' | 'completed' | 'incomplete' = 'all';
  @Output() filterChanged = new EventEmitter<
    'all' | 'completed' | 'incomplete'
  >();
  @Output() addClicked = new EventEmitter<void>();

  onSelectionChange(): void {
    this.filterChanged.emit(this.selected);
  }

  onAdd(): void {
    this.addClicked.emit();
  }
}
