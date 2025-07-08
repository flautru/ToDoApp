import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-filter',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './task-filter.component.html',
  styleUrl: './task-filter.component.css',
})
export class TaskFilterComponent {
  @Input() selected: 'all' | 'completed' | 'incomplete' = 'all';
  @Output() filterChanged = new EventEmitter<
    'all' | 'completed' | 'incomplete'
  >();
  @Output() addClicked = new EventEmitter<void>();
  @Output() validateClicked = new EventEmitter<string>();

  searchTerm: string = '';

  onSelectionChange(): void {
    this.filterChanged.emit(this.selected);
  }

  onValidateSearch(): void {
    this.validateClicked.emit(this.searchTerm.trim().toLowerCase());
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.validateClicked.emit(this.searchTerm);
  }

  onAdd(): void {
    this.addClicked.emit();
  }
}
