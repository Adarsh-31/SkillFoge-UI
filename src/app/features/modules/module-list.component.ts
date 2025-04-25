import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ModuleService } from '../../core/services/module.service';
import { Module } from '../../core/models/module.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ModuleFormComponent } from './module-form.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-module-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './module-list.component.html',
  styleUrl: './module-list.component.scss',
})
export class ModuleListComponent implements OnInit {
  modules: Module[] = [];
  courseId: string = '';

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId')!;
    this.loadModules();
  }

  loadModules(): void {
    this.moduleService.getModulesByCourseId(this.courseId).subscribe({
      next: (res) => (this.modules = res),
      error: () => console.error('Failed to load modules'),
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ModuleFormComponent, {
      width: '400px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.moduleService
          .createModule({ ...result, courseId: this.courseId })
          .subscribe(() => {
            this.loadModules();
          });
      }
    });
  }

  openEditDialog(module: Module): void {
    const dialogRef = this.dialog.open(ModuleFormComponent, {
      width: '400px',
      data: { mode: 'edit', module },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.moduleService.updateModule(module.id, result).subscribe(() => {
          this.loadModules();
        });
      }
    });
  }

  deleteModule(id: string): void {
    if (confirm('Are you sure you want to delete this module?')) {
      this.moduleService.deleteModule(id).subscribe(() => {
        this.loadModules();
      });
    }
  }
}
