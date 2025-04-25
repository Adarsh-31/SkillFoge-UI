import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Lesson, LessonService } from '../../core/services/lesson.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LessonFormComponent } from './lesson-form.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MarkdownModule,
  ],
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.scss'],
})
export class LessonListComponent implements OnInit {
  moduleId: string = '';
  lessons: Lesson[] = [];

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.paramMap.get('moduleId')!;
    this.loadLessons();
  }

  loadLessons(): void {
    this.lessonService.getLessonsByModule(this.moduleId).subscribe({
      next: (res) => (this.lessons = res),
      error: () => console.error('Failed to load lessons'),
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(LessonFormComponent, {
      width: '500px',
      height: '90vh',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.lessonService
          .createLesson({ ...result, moduleId: this.moduleId })
          .subscribe(() => {
            this.loadLessons();
          });
      }
    });
  }

  openEditDialog(lesson: Lesson): void {
    const dialogRef = this.dialog.open(LessonFormComponent, {
      width: '500px',
      height: '90vh',
      data: { mode: 'edit', lesson },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.lessonService.updateLesson(lesson.id, result).subscribe(() => {
          this.loadLessons();
        });
      }
    });
  }

  deleteLesson(id: string): void {
    if (confirm('Are you sure you want to delete this lesson?')) {
      this.lessonService.deleteLesson(id).subscribe(() => {
        this.loadLessons();
      });
    }
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1];
      url = `https://www.youtube.com/embed/${videoId}`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getOriginalYoutubeUrl(embedUrl: string): string {
    if (embedUrl.includes('/embed/')) {
      const videoId = embedUrl.split('/embed/')[1];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return embedUrl;
  }
}
