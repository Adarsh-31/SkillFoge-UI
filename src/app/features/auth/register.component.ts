import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterModule   
  ],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form:FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

    onSubmit() {
      if(this.form.invalid) 
        return;

      this.authService.register(this.form.value).subscribe({
        next: (res) => {
          this.authService.storeToken(res.token);
          this.snackBar.open(`Welcome, ${res.fullName}!`, 'Close', { duration: 3000 });
          this.router.navigate(['/courses']);
        },
        error: () => {
          this.snackBar.open('Registration failed.', 'Close', { duration: 3000 });
      }
    });
  }
}
