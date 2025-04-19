import { Injectable } from "@angular/core";
import { AuthResponse, LoginRequest } from "../models/login-request.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private readonly apiUrl = 'https://localhost:44395/api/Auth';

    constructor(private http: HttpClient) { }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/Login`, request);
    }

    storeToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    logout(): void {
        localStorage.removeItem('authToken');
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    register(data: {
        fullName: string,
        email: string,
        password: string
    }) : Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/Register`, data);
    }

}