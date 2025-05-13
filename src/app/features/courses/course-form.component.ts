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
import { FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatIconModule } from '@angular/material/icon';

import { CourseService } from '../../core/services/course.service';
import { SkillService } from '../../core/services/skill.service';
import { Skill } from '../../core/models/skill.model';
import { CourseSkillsService } from '../../core/services/course-skill.service';
import { CourseWithSkills } from '../../core/models/course-with-skills.model';
import { Tag } from '../../core/models/tag.model';
import { TagService } from '../../core/services/tag.service';

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
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent implements OnInit {
  form: FormGroup;
  skills: Skill[] = [];
  isEditMode: boolean = false;
  courseId: string | null = null;
  allTags: Tag[] = [];
  selectedTagIds: string[] = [];
  tagControl = new FormControl('');
  selectedTags: Tag[] = [];
  filteredTags: Tag[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private skillService: SkillService,
    private router: Router,
    private snackBar: MatSnackBar,
    private courseSkillService: CourseSkillsService,
    private tagService: TagService
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
    this.tagService.getAllTags().subscribe({
      next: (tags) => {
        this.allTags = tags;
        this.filteredTags = tags;
      },
    });

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

      this.tagService.getTagsByCourse(this.courseId!).subscribe({
        next: (tags) => {
          this.selectedTags = tags;
          this.selectedTagIds = tags.map((tag) => tag.id);
        },
      });
    }

    this.tagControl.valueChanges.subscribe((value) => {
      const input = value?.toLowerCase() || '';
      this.filteredTags = this.allTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(input) &&
          !this.selectedTags.find((t) => t.id === tag.id)
      );
    });
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
          next: () => {
            this.assignSkills(this.courseId!, skillIds);
            this.assignTags(this.courseId!, this.selectedTagIds);
          },
          error: () =>
            this.snackBar.open('Failed to update course.', 'Close', {
              duration: 3000,
            }),
        });
    } else {
      this.courseService.createCourse({ title, description }).subscribe({
        next: (res) => {
          this.assignSkills(res.id, skillIds);
          this.assignTags(res.id, this.selectedTagIds);
        },
        error: () =>
          this.snackBar.open('Failed to create course.', 'Close', {
            duration: 3000,
          }),
      });
    }
  }

  selectTag(tag: Tag): void {
    if (!this.selectedTags.find((t) => t.id === tag.id)) {
      this.selectedTags.push(tag);
      this.selectedTagIds.push(tag.id);
      this.tagControl.setValue('');
    }
  }

  removeTag(tag: Tag): void {
    this.selectedTags = this.selectedTags.filter((t) => t.id !== tag.id);
    this.selectedTagIds = this.selectedTagIds.filter((id) => id !== tag.id);
  }

  addTagFromInput(event: any): void {
    const inputValue = (event.value || '').trim().toLowerCase();
    const match = this.allTags.find((t) => t.name.toLowerCase() === inputValue);
    if (match && !this.selectedTags.find((t) => t.id === match.id)) {
      this.selectTag(match);
    }
    event.chipInput?.clear();
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

  private assignTags(courseId: string, tagIds: string[]): void {
    this.tagService.assignTagsToCourse(courseId, tagIds).subscribe({
      next: () => {
        console.log('Tags assigned successfully!');
      },
      error: () => {
        this.snackBar.open('Failed to assign tags.', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
