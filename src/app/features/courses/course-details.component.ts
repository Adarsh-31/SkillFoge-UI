import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { ModuleService } from '../../core/services/module.service';
import { Module } from '../../core/models/module.model';
import { LessonService, Lesson } from '../../core/services/lesson.service';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { NgZone } from '@angular/core';
import { UserLessonService } from '../../core/services/user-lesson.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-course-details',
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss',
})
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  modules: Module[] = [];
  lessonsMap: { [moduleId: string]: Lesson[] } = {};
  isLoading = true;
  relatedCourses: Course[] = [];

  courseId = '';

  completedLessonIds: string[] = [];
  totalLessons = 0;
  completedLessons = 0;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private moduleService: ModuleService,
    private lessonService: LessonService,
    private router: Router,
    private ngZone: NgZone,
    private userLessonService: UserLessonService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId')!;
    console.log('Loaded courseId:', this.courseId);

    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course = course;
      },
      error: (err) => {
        console.error('Failed to load course:', err);
        this.course = null;
        this.isLoading = false;
        this.redirectToMyCourses();
      },
    });

    this.moduleService.getModulesByCourseId(this.courseId).subscribe({
      next: (modules) => {
        this.modules = modules;
        const lessonObservables = modules.map((module) =>
          this.lessonService.getLessonsByModule(module.id)
        );

        forkJoin(lessonObservables).subscribe({
          next: (lessonsArrays) => {
            lessonsArrays.forEach((lessons, index) => {
              const moduleId = modules[index].id;
              this.lessonsMap[moduleId] = lessons;
              this.totalLessons += lessons.length;
            });

            this.loadCompletedLessons();
          },
          error: () => {
            this.isLoading = false;
          },
        });
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.loadRelatedCourses();
  }

  loadCompletedLessons(): void {
    this.userLessonService.getMyCompletedLessons().subscribe({
      next: (completedLessonIds) => {
        this.completedLessonIds = completedLessonIds;
        this.updateCompletedCount();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  updateCompletedCount(): void {
    let count = 0;
    for (const moduleId in this.lessonsMap) {
      const lessons = this.lessonsMap[moduleId];
      count += lessons.filter((lesson) =>
        this.completedLessonIds.includes(lesson.id)
      ).length;
    }
    this.completedLessons = count;
  }

  redirectToMyCourses(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => this.router.navigate(['/my-courses']));
      }, 3000);
    });
  }

  loadRelatedCourses(): void {
    this.courseService.getRelatedCourses(this.courseId).subscribe({
      next: (courses) => (this.relatedCourses = courses),
      error: () => console.warn('Failed to load related courses'),
    });
  }
}
