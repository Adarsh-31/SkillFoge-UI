import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { CourseListComponent } from './features/courses/course-list.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './features/auth/register.component';
import { CourseFormComponent } from './features/courses/course-form.component';
import { SkillListComponent } from './features/skills/skill-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'courses',
    component: CourseListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'courses/new',
    component: CourseFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'courses/:id/edit',
    component: CourseFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'skills',
    component: SkillListComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
