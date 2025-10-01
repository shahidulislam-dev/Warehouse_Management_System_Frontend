import { Component, OnInit } from '@angular/core';
import { Warehouse, WarehouseService } from '../../../services/warehouse-service';
import { AuthService } from '../../../auth/services/auth-service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CreateWarehouse } from './create-warehouse/create-warehouse';

@Component({
  selector: 'app-warehouse-management',
  standalone: false,
  templateUrl: './warehouse-management.html',
  styleUrl: './warehouse-management.css'
})
export class WarehouseManagement implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Warehouse>();
  loading = false;
  isAdmin = false;
  today: Date = new Date();

  constructor(
    private dialog: MatDialog,
    private warehouseService: WarehouseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadWarehouses();
  }

  checkAdminRole(): void {
    this.isAdmin = this.authService.isAdmin() || this.authService.isSuperAdmin();
    console.log('User is admin:', this.isAdmin);
    console.log('User role:', this.authService.getCurrentUserRole());
  }

  loadWarehouses(): void {
    this.loading = true;
    this.warehouseService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        console.log('Warehouses loaded successfully:', warehouses);
        this.dataSource.data = warehouses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
        this.loading = false;
        alert('Error loading warehouses. Please check console for details.');
      }
    });
  }

  openAddWarehouseDialog(): void {
    const dialogRef = this.dialog.open(CreateWarehouse, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Add warehouse dialog closed with result:', result);
      if (result) {
        this.loadWarehouses();
      }
    });
  }

  editWarehouse(warehouse: Warehouse): void {
    const dialogRef = this.dialog.open(CreateWarehouse, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true,
      data: { warehouse }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Edit warehouse dialog closed with result:', result);
      if (result) {
        this.loadWarehouses();
      }
    });
  }

  deleteWarehouse(warehouse: Warehouse): void {
    if (confirm(`Are you sure you want to delete warehouse "${warehouse.name}"?`)) {
      console.log('Deleting warehouse:', warehouse);
      this.warehouseService.deleteWarehouse(warehouse.id).subscribe({
        next: (response: string) => {
          console.log('Warehouse deleted successfully:', response);
          this.loadWarehouses();
        },
        error: (error) => {
          console.error('Error deleting warehouse:', error);
          let errorMessage = 'Error deleting warehouse';
          
          // Handle string error responses from backend
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized - Please check your permissions';
          } else if (error.status === 403) {
            errorMessage = 'Forbidden - You do not have permission to delete warehouses';
          } else if (error.status === 404) {
            errorMessage = 'Warehouse not found';
          }
          
          alert(errorMessage);
        }
      });
    }
  }
}