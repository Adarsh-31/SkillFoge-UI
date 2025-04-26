import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class UserCourseService {
  private readonly apiUrl = 'https://localhost:44395/api/UserCourses';

  constructor(private http: HttpClient) {}

  enroll(courseId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enroll`, courseId);
  }

  unenroll(courseId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/unenroll`, courseId);
  }

  getMyCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/my-courses`);
  }
}
