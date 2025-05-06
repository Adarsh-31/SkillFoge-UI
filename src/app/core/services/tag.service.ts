import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly baseUrl = 'https://localhost:44395/api/Tags';

  constructor(private http: HttpClient) {}

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.baseUrl);
  }

  assignTagsToCourse(courseId: string, tagIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/assign`, {
      courseId,
      tagIds,
    });
  }

  getTagsByCourse(courseId: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}/course/${courseId}`);
  }
}
