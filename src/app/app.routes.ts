import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { CourseListComponent } from './features/courses/course-list.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './features/auth/register.component';
import { CourseFormComponent } from './features/courses/course-form.component';
import { SkillListComponent } from './features/skills/skill-list.component';
import { UserListComponent } from './features/users/user-list.component';
import { guestGuard } from './core/guards/guest.guard';
import { ProfileComponent } from './features/profile/profile.component';
import { ChangePasswordComponent } from './features/profile/change-password.component';
import { adminGuard } from './core/guards/admin.guard';
import { ModuleListComponent } from './features/modules/module-list.component';
import { LessonListComponent } from './features/lessons/lesson-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'courses',
    component: CourseListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuard],
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
    path: 'users',
    component: UserListComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'courses/:courseId/modules',
    component: ModuleListComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'modules/:moduleId/lessons',
    component: LessonListComponent,
    canActivate: [authGuard, adminGuard], // 🔒 restrict to admins
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
