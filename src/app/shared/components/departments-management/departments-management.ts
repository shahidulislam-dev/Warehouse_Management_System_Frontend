import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentsService, DepartmentsResponse } from '../../../services/departments-service';
import { AuthService } from '../../../auth/services/auth-service';
import { GlobalToastrService } from '../../../services/global-toastr-service';
import { CreateDepartments } from './create-departments/create-departments';

@Component({
  selector: 'app-departments-management',
  standalone: false,
  templateUrl: './departments-management.html',
  styleUrl: './departments-management.css'
})
export class DepartmentsManagement implements OnInit {
  displayedColumns: string[] = ['id', 'departmentName', 'actions'];
  dataSource = new MatTableDataSource<DepartmentsResponse>();
  loading = false;

  constructor(
    private dialog: MatDialog,
    private departmentsService: DepartmentsService,
    public authService: AuthService,
    private toastr: GlobalToastrService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  today: Date = new Date();

  loadDepartments(): void {
    this.loading = true;
    this.departmentsService.getAllDepartments().subscribe({
      next: (departments) => {
        this.dataSource.data = departments;
        this.today = new Date();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.toastr.error('Failed to load departments');
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateDepartments, {
      width: '90vw',
      maxWidth: '500px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDepartments();
      }
    });
  }

  editDepartment(department: DepartmentsResponse): void {
    const dialogRef = this.dialog.open(CreateDepartments, {
      width: '90vw',
      maxWidth: '500px',
      disableClose: true,
      data: { department: department }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDepartments();
      }
    });
  }

  deleteDepartment(department: DepartmentsResponse): void {
    if (confirm(`Are you sure you want to delete "${department.departmentName}"?`)) {
      this.departmentsService.deleteDepartment(department.id).subscribe({
        next: () => {
          this.toastr.success('Department deleted successfully!');
          this.loadDepartments();
        },
        error: (error) => {
          console.error('Error deleting department:', error);
          this.toastr.error('Failed to delete department');
        }
      });
    }
  }
}