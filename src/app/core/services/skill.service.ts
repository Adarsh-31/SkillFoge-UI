import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private readonly apiUrl = 'https://localhost:44395/api/Skills';
  constructor(private http: HttpClient) {}

  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.apiUrl);
  }

  createSkill(skill: {
    name: string;
    description?: string;
  }): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.apiUrl, skill);
  }

  updateSkill(
    skillId: string,
    data: { name?: string; description?: string }
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${skillId}`, data);
  }

  deleteSkill(skillId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${skillId}`);
  }

  getSkillById(skillId: string): Observable<Skill> {
    return this.http.get<Skill>(`${this.apiUrl}/${skillId}`);
  }
}
