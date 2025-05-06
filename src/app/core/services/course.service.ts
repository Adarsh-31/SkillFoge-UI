import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly apiUrl = 'https://localhost:44395/api/Courses';

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  createCourse(course: {
    title: string;
    description?: string;
  }): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.apiUrl, course);
  }

  updateCourse(
    courseId: string,
    course: { title: string; description?: string }
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${courseId}`, course);
  }

  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}`);
  }

  getCourseById(courseId: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${courseId}`);
  }

  getCoursesByTag(tagId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/by-tag/${tagId}`);
  }

  getRelatedCourses(courseId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/${courseId}/related`);
  }
}
