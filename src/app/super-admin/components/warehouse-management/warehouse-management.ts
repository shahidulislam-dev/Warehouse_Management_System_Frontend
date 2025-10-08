import { Component, OnInit } from '@angular/core';
import { Warehouse, WarehouseService } from '../../../services/warehouse-service';
import { AuthService } from '../../../auth/services/auth-service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CreateWarehouse } from './create-warehouse/create-warehouse';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { GlobalToastrService } from '../../../services/global-toastr-service';

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
    private authService: AuthService,
    private toastr: GlobalToastrService 
  ) {}

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadWarehouses();
  }

  checkAdminRole(): void {
    this.isAdmin = this.authService.isAdmin() || this.authService.isSuperAdmin();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.warehouseService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        this.dataSource.data = warehouses;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Error loading warehouses. Please check console for details.');
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
      if (result) {
        this.loadWarehouses();
      }
    });
  }

  deleteWarehouse(warehouse: Warehouse): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Delete Warehouse',
        message: `Are you sure you want to delete warehouse "${warehouse.name}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.warehouseService.deleteWarehouse(warehouse.id).subscribe({
          next: (response: string) => {
            this.toastr.success('Warehouse deleted successfully!');
            this.loadWarehouses();
          },
          error: (error) => {
            let errorMessage = 'Error deleting warehouse';
            
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

            this.toastr.error(errorMessage);
          }
        });
      }
    });
  }
}