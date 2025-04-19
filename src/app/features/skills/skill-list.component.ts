import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SkillService } from '../../core/services/skill.service';
import { Skill } from '../../core/models/skill.model';
import { SkillFormComponent } from '../../features/skills/skill-form.component';

@Component({
  selector: 'app-skill-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './skill-list.component.html',
  styleUrl: './skill-list.component.scss',
})
export class SkillListComponent implements OnInit {
  skills: Skill[] = [];

  constructor(
    private skillService: SkillService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.skillService.getAllSkills().subscribe({
      next: (res) => (this.skills = res),
      error: () =>
        this.snackBar.open('Failed to load skills', 'Close', {
          duration: 3000,
        }),
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(SkillFormComponent, {
      width: '400px',
      data: {
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.skillService.createSkill(result).subscribe({
          next: () => {
            this.snackBar.open('Skill created successfully!', 'Close', {
              duration: 3000,
            });
            this.loadSkills();
          },
          error: () =>
            this.snackBar.open('Failed to create skill', 'Close', {
              duration: 3000,
            }),
        });
      }
    });
  }

  openEditDialog(skill: Skill): void {
    const dialogRef = this.dialog.open(SkillFormComponent, {
      width: '400px',
      data: {
        mode: 'edit',
        skill,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.skillService.updateSkill(skill.id, result).subscribe({
          next: () => {
            this.snackBar.open('Skill updated successfully!', 'Close', {
              duration: 3000,
            });
            this.loadSkills();
          },
          error: () =>
            this.snackBar.open('Failed to update skill', 'Close', {
              duration: 3000,
            }),
        });
      }
    });
  }

  deleteSkill(id: string): void {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    this.skillService.deleteSkill(id).subscribe({
      next: () => {
        this.skills = this.skills.filter((skill) => skill.id !== id);
        this.snackBar.open('Skill deleted', 'Close', { duration: 3000 });
      },
      error: () =>
        this.snackBar.open('Failed to delete skill', 'Close', {
          duration: 3000,
        }),
    });
  }
}
