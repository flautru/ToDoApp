import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User, UserDto } from '../../models/user.model';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { Page } from '../../../../core/models/page.model';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ErrorHandlerService } from '../../../../core/services/error/error-handler.service';

@Component({
  selector: 'app-user-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  users: UserDto[] = [];
  displayedColumns: string[] = ['username', 'role', 'actions'];

  page = 0;
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UsersService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.loadUsers(this.page, this.pageSize);
  }

  loadUsers(page: number, size: number): void {
    this.userService.getUsers(page, size).subscribe((data: Page<UserDto>) => {
      this.users = data.content;
      this.totalElements = data.totalElements;
      this.currentPage = data.number;
    });
  }

  onPageChange(event: PageEvent): void {
    this.loadUsers(event.pageIndex, event.pageSize);
  }

  confirmDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUserById(id).subscribe({
        next: () => {
          this.loadUsers(this.currentPage, this.pageSize);
        },
        error: (err) => {
          this.errorHandler.handle('Erreur lors de la suppression', err);
        },
      });
    }
  }
}
