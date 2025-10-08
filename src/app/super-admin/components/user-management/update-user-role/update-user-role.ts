import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalToastrService } from '../../../../services/global-toastr-service';
import { UserService } from '../../../../services/user-service';
import { User } from '../../../../services/user-service';
import { AuthService } from '../../../../auth/services/auth-service';

@Component({
  selector: 'app-update-user-role',
  standalone: false,
  templateUrl: './update-user-role.html',
  styleUrl: './update-user-role.css'
})
export class UpdateUserRole implements OnInit {
  roleForm: FormGroup;
  loading = false;
  availableRoles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public authService: AuthService,
    public dialogRef: MatDialogRef<UpdateUserRole>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private toastr: GlobalToastrService
  ) {
    this.roleForm = this.fb.group({
      role: ['', Validators.required]
    });

    this.setAvailableRoles();
  }

  ngOnInit(): void {
    if (this.data.user) {
      this.roleForm.patchValue({
        role: this.data.user.role
      });
    }
  }

  private setAvailableRoles(): void {
    const isSuperAdmin = this.authService.isSuperAdmin();
    const currentUser = this.authService.getCurrentUser();
    
    if (isSuperAdmin) {
      // Super admin can assign any role except to themselves
      if (this.data.user.email === currentUser?.email) {
        this.availableRoles = [this.data.user.role]; // Can't change own role
      } else {
        this.availableRoles = ['staff', 'admin', 'super-admin'];
      }
    } else {
      // Admin can only assign staff or admin roles to staff users
      if (this.data.user.role === 'staff') {
        this.availableRoles = ['staff', 'admin'];
      } else {
        this.availableRoles = [this.data.user.role]; // Can't change admin/super-admin roles
      }
    }
  }

  onSubmit(): void {
    if (this.roleForm.valid && this.data.user) {
      this.loading = true;
      const newRole = this.roleForm.value.role;

      // Check if role is actually changing
      if (newRole === this.data.user.role) {
        this.toastr.warning('User already has this role');
        this.dialogRef.close(false);
        return;
      }

      // Use the new updateUserRole method
      this.userService.updateUserRole(this.data.user.id, newRole).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.toastr.success('User role updated successfully!');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating user role:', error);
          this.loading = false;
          
          let errorMessage = 'Error updating user role';
          
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

  // Helper method to check if role can be changed
  canChangeRole(): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    // Prevent self-role-change
    if (this.data.user.email === currentUser?.email) {
      return false;
    }

    const currentUserRole = this.authService.getCurrentUserRole();
    const targetUserRole = this.data.user.role;

    if (currentUserRole === 'super-admin') {
      return true; // Super-admin can change anyone's role
    }

    if (currentUserRole === 'admin') {
      return targetUserRole === 'staff'; // Admin can only change staff roles
    }

    return false;
  }
}