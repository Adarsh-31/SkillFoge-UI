export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    fullName: string;
    email: string;
    token: string;
}
