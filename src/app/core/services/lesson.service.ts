import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs';

export interface Lesson {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  moduleId: string;
}

@Injectable({ providedIn: 'root' })
export class LessonService {
  private readonly apiUrl = 'https://localhost:44395/api/Lessons';

  constructor(private http: HttpClient) {}

  getLessonsByModule(moduleId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/module/${moduleId}`);
  }

  createLesson(lesson: Omit<Lesson, 'id'>): Observable<Lesson> {
    return this.http.post<Lesson>(this.apiUrl, lesson);
  }

  updateLesson(id: string, lesson: Partial<Lesson>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, lesson);
  }

  deleteLesson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getLessonById(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${id}`);
  }
}
