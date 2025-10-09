import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Warehouse, WarehouseService } from '../../../services/warehouse-service';
import { AuthService } from '../../../auth/services/auth-service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalToastrService } from '../../../services/global-toastr-service'; // Import global service
import { FloorsService, FloorWrapper } from '../../../services/floors-service';
import { CreateFloor } from './create-floor/create-floor';

@Component({
  selector: 'app-floor-management',
  standalone: false,
  templateUrl: './floor-management.html',
  styleUrl: './floor-management.css'
})
export class FloorManagement implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'warehouseName', 'actions'];
  dataSource = new MatTableDataSource<FloorWrapper>();
  loading = false;
  today: Date = new Date();
  
  warehouses: Warehouse[] = [];
  selectedWarehouseId: number | null = null;
  selectedWarehouseName: string = 'All Warehouses';

  constructor(
    private dialog: MatDialog,
    private floorsService: FloorsService,
    private warehouseService: WarehouseService,
    public authService: AuthService,
    private toastr: GlobalToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses;
        this.setupRouteListener();
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
        this.toastr.error('Failed to load warehouses'); 
        this.setupRouteListener();
      }
    });
  }

  setupRouteListener(): void {
    this.route.params.subscribe(params => {
      const warehouseId = params['warehouseId'];

      if (warehouseId) {
        this.loadFloorsByWarehouseAndUpdateRoute(parseInt(warehouseId));
      } else {
        this.loadAllFloorsAndUpdateRoute();
      }
    });
  }

  navigateToAllFloors(): void {
    const baseRoute = this.authService.getDashboardRoute();
    this.router.navigate([baseRoute + '/floors/all']);
  }

  navigateToWarehouseFloors(warehouseId: number): void {
    const baseRoute = this.authService.getDashboardRoute();
    this.router.navigate([baseRoute + '/floors/warehouse', warehouseId]);
  }

  loadAllFloorsAndUpdateRoute(): void {
    this.loading = true;
    this.selectedWarehouseId = null;
    this.selectedWarehouseName = 'All Warehouses';
    
    this.floorsService.getAllFloors().subscribe({
      next: (floors) => {
        this.dataSource.data = floors;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading all floors:', error);
        this.loading = false;
        this.toastr.error('Failed to load floors'); 
      }
    });
  }

  loadFloorsByWarehouseAndUpdateRoute(warehouseId: number): void {
    this.loading = true;
    this.selectedWarehouseId = warehouseId;
    
    const selectedWarehouse = this.warehouses.find(w => w.id === warehouseId);
    this.selectedWarehouseName = selectedWarehouse ? selectedWarehouse.name : `Warehouse ${warehouseId}`;
    
    this.floorsService.getFloorsByWarehouseId(warehouseId).subscribe({
      next: (floors) => {
        this.dataSource.data = floors;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading floors by warehouse:', error);
        this.loading = false;
        this.toastr.error('Failed to load floors'); 
      }
    });
  }

  showAllFloors(): void {
    this.navigateToAllFloors();
  }

  showFloorsByWarehouse(warehouseId: number): void {
    this.navigateToWarehouseFloors(warehouseId);
  }

  openAddFloorDialog(): void {
    const dialogRef = this.dialog.open(CreateFloor, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true,
      data: { warehouses: this.warehouses }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Floor created successfully!');
        this.reloadBasedOnCurrentRoute();
      }
    });
  }

  editFloor(floor: FloorWrapper): void {
    const dialogRef = this.dialog.open(CreateFloor, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true,
      data: { 
        floor: floor,
        warehouses: this.warehouses
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Floor updated successfully!'); 
        this.reloadBasedOnCurrentRoute();
      }
    });
  }

  deleteFloor(floor: FloorWrapper): void {
    if (confirm(`Are you sure you want to delete floor "${floor.name}"?`)) {
      this.floorsService.deleteFloor(floor.id).subscribe({
        next: (response: string) => {
          this.toastr.success('Floor deleted successfully!');
          this.reloadBasedOnCurrentRoute();
        },
        error: (error) => {
          console.error('Error deleting floor:', error);
          let errorMessage = 'Error deleting floor';
          
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.toastr.error(errorMessage); 
        }
      });
    }
  }

  private reloadBasedOnCurrentRoute(): void {
    if (this.selectedWarehouseId) {
      this.loadFloorsByWarehouseAndUpdateRoute(this.selectedWarehouseId);
    } else {
      this.loadAllFloorsAndUpdateRoute();
    }
  }
}