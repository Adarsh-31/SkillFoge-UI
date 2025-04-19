import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Skill } from '../../core/models/skill.model';

@Component({
  selector: 'app-skill-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './skill-form.component.html',
  styleUrl: './skill-form.component.scss',
})
export class SkillFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { skill?: Skill; mode: 'create' | 'edit' },
    private dialogRef: MatDialogRef<SkillFormComponent>
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });

    this.isEditMode = data.mode === 'edit';
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.skill) {
      this.form.patchValue({
        name: this.data.skill.name,
        description: this.data.skill.description,
      });
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
