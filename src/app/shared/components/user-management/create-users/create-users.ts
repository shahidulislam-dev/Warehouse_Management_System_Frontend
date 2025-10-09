import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalToastrService } from '../../../../services/global-toastr-service';
import { AuthService } from '../../../../auth/services/auth-service';
@Component({
  selector: 'app-create-users',
  standalone: false,
  templateUrl: './create-users.html',
  styleUrl: './create-users.css'
})
export class CreateUsers implements OnInit {
  userForm: FormGroup;
  loading = false;
  isSuperAdminCreation = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateUsers>,
    @Inject(MAT_DIALOG_DATA) public data: { isSuperAdmin: boolean },
    private toastr: GlobalToastrService
  ) {
    this.isSuperAdminCreation = data?.isSuperAdmin || false;
    
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const formData = this.userForm.value;

      const operation = this.isSuperAdminCreation 
        ? this.authService.createSuperAdmin(formData)
        : this.authService.signup(formData);

      operation.subscribe({
        next: (response: any) => {
          this.loading = false;
          this.toastr.success(`${this.isSuperAdminCreation ? 'Super Admin' : 'User'} created successfully!`);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.loading = false;
          
          let errorMessage = `Error creating ${this.isSuperAdminCreation ? 'super admin' : 'user'}`;
          
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized - Please check your permissions';
          } else if (error.status === 403) {
            errorMessage = 'Forbidden - You do not have permission to perform this action';
          }
          
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
