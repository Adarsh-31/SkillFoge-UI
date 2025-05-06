import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { UserCourseService } from '../../core/services/user-course.service';
import { Course } from '../../core/models/course.model';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Tag } from '../../core/models/tag.model';
import { TagService } from '../../core/services/tag.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  isAdmin = false;
  tags: Tag[] = [];
  selectedTagId: string = '';

  constructor(
    private courseService: CourseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userCourseService: UserCourseService,
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadTags();
    this.loadCourses();
  }
  editCourse(id: string): void {
    this.router.navigate([`/courses/${id}/edit`]);
  }

  deleteCourse(id: string): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this course?'
    );

    if (confirmDelete) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.snackBar.open('Course deleted successfully', 'Dismiss', {
            duration: 2000,
          });
          this.courses = this.courses.filter((course) => course.id !== id);
        },
        error: (error) => {
          this.snackBar.open('Error deleting course', 'Dismiss', {
            duration: 2000,
          });
        },
      });
    }
  }
  enroll(courseId: string): void {
    this.userCourseService.enroll(courseId).subscribe(() => {
      this.snackBar.open('Enrolled successfully!', 'Close', { duration: 3000 });
    });
  }

  loadTags(): void {
    this.tagService.getAllTags().subscribe((tags) => (this.tags = tags));
  }

  filterCoursesByTag(): void {
    if (this.selectedTagId) {
      this.courseService
        .getCoursesByTag(this.selectedTagId)
        .subscribe((courses) => {
          this.courses = courses;
        });
    } else {
      this.loadCourses();
    }
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => {
        this.snackBar.open('Error fetching courses', 'Dismiss', {
          duration: 2000,
        });
      },
    });
  }

  filterByClickedTag(tagId: string): void {
    this.selectedTagId = tagId;
    this.filterCoursesByTag();
  }
}
