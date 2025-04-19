import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseWithSkills } from '../models/course-with-skills.model';
import { Skill } from '../models/skill.model';

@Injectable({ providedIn: 'root' })
export class CourseSkillsService {
  private readonly apiUrl = 'https://localhost:44395/api/CourseSkills';
  constructor(private http: HttpClient) {}

  getCourseWithSkills(courseId: string): Observable<CourseWithSkills> {
    return this.http.get<CourseWithSkills>(
      `${this.apiUrl}/course/${courseId}/with-skills`
    );
  }

  assignSkillsToCourse(courseId: string, skillIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/assign`, {
      courseId,
      skillIds,
    });
  }

  addSkillToCourse(courseId: string, skillId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, { courseId, skillId });
  }

  removeSkillFromCourse(courseId: string, skillId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/remove`, { courseId, skillId });
  }

  getSkillsByCourse(courseId: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/course/${courseId}/skills`);
  }
}
