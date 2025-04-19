import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CourseService } from '../../core/services/course.service';
import { SkillService } from '../../core/services/skill.service';
import { Skill } from '../../core/models/skill.model';
import { CourseSkillsService } from '../../core/services/course-skill.service';
import { CourseWithSkills } from '../../core/models/course-with-skills.model';

@Component({
  selector: 'app-course-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent implements OnInit {
  form: FormGroup;
  skills: Skill[] = [];
  isEditMode: boolean = false;
  courseId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private skillService: SkillService,
    private router: Router,
    private snackBar: MatSnackBar,
    private courseSkillService: CourseSkillsService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      skillIds: [[]],
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.courseId;
    this.loadSkills();

    if (this.isEditMode) {
      this.courseSkillService.getCourseWithSkills(this.courseId!).subscribe({
        next: (course: CourseWithSkills) => {
          this.form.patchValue({
            title: course.title,
            description: course.description,
            skillIds: course.skills.map((skill) => skill.id),
          });
        },
        error: () => {
          this.snackBar.open('Failed to load course details', 'Dismiss', {
            duration: 2000,
          });
          this.router.navigate(['/courses']);
        },
      });
    }
  }

  loadSkills(): void {
    this.skillService.getAllSkills().subscribe({
      next: (skills: Skill[]) => {
        this.skills = skills;
      },
      error: () => {
        this.snackBar.open('Failed to load skills', 'Dismiss', {
          duration: 2000,
        });
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { title, description, skillIds } = this.form.value;

    if (this.isEditMode && this.courseId) {
      this.courseService
        .updateCourse(this.courseId, { title, description })
        .subscribe({
          next: () => this.assignSkills(this.courseId!, skillIds),
          error: () =>
            this.snackBar.open('Failed to update course.', 'Close', {
              duration: 3000,
            }),
        });
    } else {
      this.courseService.createCourse({ title, description }).subscribe({
        next: (res) => this.assignSkills(res.id, skillIds),
        error: () =>
          this.snackBar.open('Failed to create course.', 'Close', {
            duration: 3000,
          }),
      });
    }
  }

  private assignSkills(courseId: string, skillIds: string[]): void {
    this.courseSkillService.assignSkillsToCourse(courseId, skillIds).subscribe({
      next: () => {
        this.snackBar.open(
          `Course ${this.isEditMode ? 'updated' : 'created'} successfully!`,
          'Close',
          { duration: 3000 }
        );
        this.router.navigate(['/courses']);
      },
      error: () =>
        this.snackBar.open('Failed to assign skills.', 'Close', {
          duration: 3000,
        }),
    });
  }
}
