import { Component, OnInit } from '@angular/core';
import { Course } from '../../core/models/course.model';
import { UserCourseService } from '../../core/services/user-course.service';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-courses',
  imports: [CommonModule, RouterModule, MatCardModule],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss',
})
export class MyCoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(
    private userCourseService: UserCourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userCourseService.getMyCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => {
        console.error('Error loading my courses:', error);
      },
    });
  }

  openCourseDetails(courseId: string): void {
    this.router.navigate(['/courses', courseId, 'details']);
  }
}
