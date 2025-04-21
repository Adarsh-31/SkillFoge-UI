import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'https://localhost:44395/api/Users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
  }): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.apiUrl, data);
  }

  updateUser(
    id: string,
    data: {
      fullName: string;
      email: string;
      password: string;
      role: string;
    }
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
