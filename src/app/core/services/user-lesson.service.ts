import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserLessonService {
  private readonly apiUrl = 'https://localhost:44395/api/UserLessons';

  constructor(private http: HttpClient) {}

  markLessonCompleted(lessonId: string): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<void>(
      `${this.apiUrl}/complete`,
      { lessonId },
      { headers }
    );
  }

  getMyCompletedLessons(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/my-completed-lessons`);
  }
}
