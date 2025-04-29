import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LessonService } from '../../core/services/lesson.service';
import { Lesson } from '../../core/services/lesson.service';
import { MatCardModule } from '@angular/material/card';
import { MarkdownModule } from 'ngx-markdown';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { UserLessonService } from '../../core/services/user-lesson.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lesson-details',
  imports: [
    CommonModule,
    MatCardModule,
    MarkdownModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './lesson-details.component.html',
  styleUrl: './lesson-details.component.scss',
})
export class LessonDetailsComponent implements OnInit {
  lesson: Lesson | null = null;
  lessonId: string = '';
  safeVideoUrl: SafeResourceUrl | null = null;
  isCompleted = false;

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private sanitizer: DomSanitizer,
    private userLessonService: UserLessonService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('lessonId')!;
    this.lessonService.getLessonById(this.lessonId).subscribe({
      next: (lesson) => {
        this.lesson = lesson;
        if (lesson.videoUrl) {
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            lesson.videoUrl
          );
        }
      },
      error: (error) => {
        console.error('Error loading lesson:', error);
      },
    });

    this.userLessonService.getMyCompletedLessons().subscribe({
      next: (completedLessons) => {
        this.isCompleted = completedLessons.includes(this.lessonId);
      },
    });
  }

  markCompleted(): void {
    this.userLessonService.markLessonCompleted(this.lessonId).subscribe({
      next: () => {
        this.isCompleted = true;
        this.snackBar.open('Lesson marked as completed!', 'Close', {
          duration: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/my-courses']);
        }, 2000);
      },
      error: () => {
        this.snackBar.open('Failed to mark lesson as completed', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
