import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { User } from '../../core/models/user-model';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  isSelfEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'edit';
      user?: User;
      currentUserId: string;
      currentUserRole: string;
    }
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required],
      password: [''],
    });

    this.isEditMode = data.mode === 'edit';
    this.isSelfEdit = data.user?.id === data.currentUserId;
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.user) {
      this.form.patchValue({
        fullName: this.data.user.fullName,
        email: this.data.user.email,
        role: this.data.user.role,
      });

      this.form.get('password')?.disable();
    }

    const isNotAdmin = this.data.currentUserRole !== 'Admin';
    const isSelfEdit = this.isSelfEdit;

    if (isNotAdmin) {
      this.form.get('role')?.disable();
    }
  }

  submit(): void {
    if (this.form.valid) {
      const result = this.form.getRawValue();
      this.dialogRef.close(result);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
