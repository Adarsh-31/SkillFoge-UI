import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from './user-form.component';
import { AuthService } from '../../core/services/auth.service';

import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user-model';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  currentUserId: string = '';

  constructor(
    private userService: UserService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
    this.currentUserId = decoded?.sub || '';
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: () => {
        this.snackbar.open('Failed to load Users', 'Close', { duration: 3000 });
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: {
        mode: 'create',
        currentUserId: this.currentUserId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.createUser(result).subscribe({
          next: () => {
            this.snackbar.open('User created successfully', 'Close', {
              duration: 3000,
            });
            this.loadUsers();
          },
          error: () => {
            this.snackbar.open('Failed to create user', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: {
        mode: 'edit',
        user,
        currentUserId: this.currentUserId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.updateUser(user.id, result).subscribe({
          next: () => {
            this.snackbar.open('User updated successfully', 'Close', {
              duration: 3000,
            });
            this.loadUsers();
          },
          error: () => {
            this.snackbar.open('Failed to update user', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  deleteUser(userId: string): void {
    if (!confirm('Are your sure you want to delete this user?')) return;
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.id !== userId);
        this.snackbar.open('User Deleted', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackbar.open('Failed to delete', 'close', { duration: 3000 });
      },
    });
  }
}
