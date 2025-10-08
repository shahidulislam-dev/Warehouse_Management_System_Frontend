import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Warehouse, WarehouseService } from '../../../services/warehouse-service';
import { AuthService } from '../../../auth/services/auth-service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalToastrService } from '../../../services/global-toastr-service';
import { RoomsService, RoomsWrapper } from '../../../services/rooms-service';
import { FloorsService, FloorWrapper } from '../../../services/floors-service';
import { CreateRoom } from './create-room/create-room';

@Component({
  selector: 'app-rooms-management',
  standalone: false,
  templateUrl: './rooms-management.html',
  styleUrl: './rooms-management.css'
})
export class RoomsManagement implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'floorName', 'warehouseName', 'actions'];
  dataSource = new MatTableDataSource<RoomsWrapper>();
  loading = false;
  isAdmin = false;
  today: Date = new Date();
  
  warehouses: Warehouse[] = [];
  floors: FloorWrapper[] = [];
  selectedWarehouseId: number | null = null;
  selectedFloorId: number | null = null;
  selectedWarehouseName: string = 'All Warehouses';
  selectedFloorName: string = 'All Floors';

  constructor(
    private dialog: MatDialog,
    private roomsService: RoomsService,
    private warehouseService: WarehouseService,
    private floorsService: FloorsService,
    private authService: AuthService,
    private toastr: GlobalToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadWarehouses();
  }

  checkAdminRole(): void {
    this.isAdmin = this.authService.isAdmin() || this.authService.isSuperAdmin();
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
      const floorId = params['floorId'];

      if (warehouseId && floorId) {
        this.loadRoomsByFloorAndUpdateRoute(parseInt(warehouseId), parseInt(floorId));
      } else if (warehouseId) {
        this.loadRoomsByWarehouseAndUpdateRoute(parseInt(warehouseId));
      } else {
        this.loadAllRoomsAndUpdateRoute();
      }
    });
  }

  loadFloorsByWarehouse(warehouseId: number): void {
    this.floorsService.getFloorsByWarehouseId(warehouseId).subscribe({
      next: (floors) => {
        this.floors = floors;
      },
      error: (error) => {
        console.error('Error loading floors:', error);
        this.toastr.error('Failed to load floors');
      }
    });
  }

  navigateToAllRooms(): void {
    this.router.navigate(['/super-admin/rooms/all']);
  }

  navigateToWarehouseRooms(warehouseId: number): void {
    this.router.navigate(['/super-admin/rooms/warehouse', warehouseId]);
  }

  navigateToFloorRooms(warehouseId: number, floorId: number): void {
    this.router.navigate(['/super-admin/rooms/warehouse', warehouseId, 'floor', floorId]);
  }

  loadAllRoomsAndUpdateRoute(): void {
    this.loading = true;
    this.selectedWarehouseId = null;
    this.selectedFloorId = null;
    this.selectedWarehouseName = 'All Warehouses';
    this.selectedFloorName = 'All Floors';
    this.floors = [];
    
    this.roomsService.getAllRooms().subscribe({
      next: (rooms) => {
        this.dataSource.data = rooms;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading all rooms:', error);
        this.loading = false;
        this.toastr.error('Failed to load rooms');
      }
    });
  }

  loadRoomsByWarehouseAndUpdateRoute(warehouseId: number): void {
    this.loading = true;
    this.selectedWarehouseId = warehouseId;
    this.selectedFloorId = null;
    this.selectedFloorName = 'All Floors';
    
    const selectedWarehouse = this.warehouses.find(w => w.id === warehouseId);
    this.selectedWarehouseName = selectedWarehouse ? selectedWarehouse.name : `Warehouse ${warehouseId}`;
    
    this.loadFloorsByWarehouse(warehouseId);
    
    this.roomsService.getRoomsByWarehouseId(warehouseId).subscribe({
      next: (rooms) => {
        this.dataSource.data = rooms;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rooms by warehouse:', error);
        this.loading = false;
        this.toastr.error('Failed to load rooms');
      }
    });
  }

  loadRoomsByFloorAndUpdateRoute(warehouseId: number, floorId: number): void {
    this.loading = true;
    this.selectedWarehouseId = warehouseId;
    this.selectedFloorId = floorId;
    
    const selectedWarehouse = this.warehouses.find(w => w.id === warehouseId);
    const selectedFloor = this.floors.find(f => f.id === floorId);
    
    this.selectedWarehouseName = selectedWarehouse ? selectedWarehouse.name : `Warehouse ${warehouseId}`;
    this.selectedFloorName = selectedFloor ? selectedFloor.name : `Floor ${floorId}`;
    
    this.loadFloorsByWarehouse(warehouseId);
    
    this.roomsService.getRoomsByFloorAndWarehouse(floorId, warehouseId).subscribe({
      next: (rooms) => {
        this.dataSource.data = rooms;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rooms by floor:', error);
        this.loading = false;
        this.toastr.error('Failed to load rooms');
      }
    });
  }

  showAllRooms(): void {
    this.navigateToAllRooms();
  }

  showRoomsByWarehouse(warehouseId: number): void {
    this.navigateToWarehouseRooms(warehouseId);
  }

  showRoomsByFloor(floorId: number): void {
    if (this.selectedWarehouseId) {
      this.navigateToFloorRooms(this.selectedWarehouseId, floorId);
    }
  }

  openAddRoomDialog(): void {
    const dialogRef = this.dialog.open(CreateRoom, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true,
      data: { 
        warehouses: this.warehouses,
        floors: this.floors
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Room created successfully!');
        this.reloadBasedOnCurrentRoute();
      }
    });
  }

  editRoom(room: RoomsWrapper): void {
    const dialogRef = this.dialog.open(CreateRoom, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true,
      data: { 
        room: room,
        warehouses: this.warehouses,
        floors: this.floors
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Room updated successfully!');
        this.reloadBasedOnCurrentRoute();
      }
    });
  }

  deleteRoom(room: RoomsWrapper): void {
    if (confirm(`Are you sure you want to delete room "${room.name}"?`)) {
      this.roomsService.deleteRoom(room.id).subscribe({
        next: (response: string) => {
          this.toastr.success('Room deleted successfully!');
          this.reloadBasedOnCurrentRoute();
        },
        error: (error) => {
          console.error('Error deleting room:', error);
          let errorMessage = 'Error deleting room';
          
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized - Please check your permissions';
          } else if (error.status === 403) {
            errorMessage = 'Forbidden - You do not have permission to delete rooms';
          } else if (error.status === 404) {
            errorMessage = 'Room not found';
          }
          
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  private reloadBasedOnCurrentRoute(): void {
    if (this.selectedFloorId && this.selectedWarehouseId) {
      this.loadRoomsByFloorAndUpdateRoute(this.selectedWarehouseId, this.selectedFloorId);
    } else if (this.selectedWarehouseId) {
      this.loadRoomsByWarehouseAndUpdateRoute(this.selectedWarehouseId);
    } else {
      this.loadAllRoomsAndUpdateRoute();
    }
  }
}