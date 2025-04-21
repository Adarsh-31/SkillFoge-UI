import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  fullName = '';
  email = '';
  role = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.fullName =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      this.role =
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      this.email = payload.email;
    }
  }
}
