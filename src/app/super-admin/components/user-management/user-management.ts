import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../../services/user-service';
import { AuthService } from '../../../auth/services/auth-service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalToastrService } from '../../../services/global-toastr-service';
import { CreateUsers } from './create-users/create-users';
import { UpdateUserRole } from './update-user-role/update-user-role';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  displayedColumns: string[] = ['id', 'fullName', 'email', 'contactNumber', 'role', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>();
  loading = false;
  isAdmin = false;
  isSuperAdmin = false;
  today: Date = new Date();

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,
    private toastr: GlobalToastrService
  ) {}

  ngOnInit(): void {
    this.checkUserRoles();
    this.loadUsers();
  }

  checkUserRoles(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isSuperAdmin = this.authService.isSuperAdmin();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
        this.toastr.error('Failed to load users');
      }
    });
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUsers, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('User created successfully!');
        this.loadUsers();
      }
    });
  }

  openCreateSuperAdminDialog(): void {
    const dialogRef = this.dialog.open(CreateUsers, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true,
      data: { isSuperAdmin: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Super Admin created successfully!');
        this.loadUsers();
      }
    });
  }

  changeUserRole(user: User): void {
    if (!this.canEditUser(user)) {
      this.toastr.warning('You are not authorized to change this user\'s role');
      return;
    }

    const dialogRef = this.dialog.open(UpdateUserRole, {
      width: '90vw',
      maxWidth: '400px',
      maxHeight: '90vh',
      disableClose: true,
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('User role updated successfully!');
        this.loadUsers();
      }
    });
  }

  toggleUserStatus(user: User): void {
    if (!this.canEditUser(user)) {
      this.toastr.warning('You are not authorized to change this user\'s status');
      return;
    }

    const newStatus = user.status === 'true' ? 'false' : 'true';
    this.updateUserStatus(user, newStatus);
  }

  private updateUserStatus(user: User, newStatus: string): void {
    const updatedUsers = this.dataSource.data.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    );
    this.dataSource.data = updatedUsers;

    this.userService.updateUserStatus(user.id, newStatus).subscribe({
      next: (response: string) => {
        const action = newStatus === 'true' ? 'activated' : 'deactivated';
        this.toastr.success(`User ${action} successfully!`);
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        
        const revertedUsers = this.dataSource.data.map(u => 
          u.id === user.id ? { ...u, status: user.status } : u
        );
        this.dataSource.data = revertedUsers;

        let errorMessage = 'Error updating user status';
        
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.toastr.error(errorMessage);
      }
    });
  }

  canEditUser(user: User): boolean {
    const currentUserRole = this.authService.getCurrentUserRole();
    
    if (this.isSuperAdmin) {
      return user.role !== 'super-admin' || user.email !== this.authService.getCurrentUser()?.email;
    }
    
    if (this.isAdmin) {
      return user.role === 'staff';
    }
    
    return false;
  }

  getStatusBadgeClass(status: string): string {
    return status === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'super-admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: string): string {
    return status === 'true' ? 'toggle_on' : 'toggle_off';
  }

  getStatusTooltip(status: string): string {
    return status === 'true' ? 'Deactivate User' : 'Activate User';
  }
}