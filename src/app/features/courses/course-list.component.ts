import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { UserCourseService } from '../../core/services/user-course.service';
import { Course } from '../../core/models/course.model';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  isAdmin = false;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userCourseService: UserCourseService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      },
    });
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
}
