import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  title = 'skillforge';
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    setInterval(() => {
      if (this.authService.isTokenExpired()) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    }, 60_000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return !this.authService.isTokenExpired();
  }
}
