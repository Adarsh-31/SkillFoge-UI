import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Module } from '../models/module.model';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private readonly apiUrl = 'https://localhost:44395/api/CourseModules';
  constructor(private http: HttpClient) {}

  getModulesByCourseId(courseId: string): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.apiUrl}/course/${courseId}`);
  }

  createModule(module: {
    title: string;
    description?: string;
    courseId: string;
  }): Observable<Module> {
    return this.http.post<Module>(this.apiUrl, module);
  }

  updateModule(
    id: string,
    module: { title: string; description?: string }
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, module);
  }

  deleteModule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
