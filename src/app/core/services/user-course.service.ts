import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class UserCourseService {
  private readonly apiUrl = 'https://localhost:44395/api/UserCourses';

  constructor(private http: HttpClient) {}

  enroll(courseId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/enroll`, { courseId }, { headers });
  }

  unenroll(courseId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(
      `${this.apiUrl}/unenroll`,
      { courseId },
      { headers }
    );
  }

  getMyCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/my-courses`);
  }
}
