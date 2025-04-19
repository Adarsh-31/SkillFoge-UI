import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginform: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
        this.loginform = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]]
        });
      }

  onSubmit(){
    if(this.loginform.invalid) return;

    const credentials: LoginRequest = this.loginform.value;
    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.authService.storeToken(res.token);
        this.snackBar.open(`Welcome, ${res.fullName}!`, 'Close', { duration: 3000 });
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 3000 });
        console.error(err);
      }
    })
  }
}
