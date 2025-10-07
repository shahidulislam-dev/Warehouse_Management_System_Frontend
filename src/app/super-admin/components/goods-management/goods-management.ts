// components/goods-management/goods-management.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Warehouse, WarehouseService } from '../../../services/warehouse-service';
import { AuthService } from '../../../auth/services/auth-service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FloorsService, FloorWrapper } from '../../../services/floors-service';
import { RoomsService, RoomsWrapper } from '../../../services/rooms-service';
import { GoodsService, GoodsWrapper, GoodsCategory } from '../../../services/goods-service';
import { CreateGoods } from './create-goods/create-goods';
import { CategoryService } from '../../../services/category-service';

@Component({
  selector: 'app-goods-management',
  standalone: false,
  templateUrl: './goods-management.html',
  styleUrl: './goods-management.css'
})
export class GoodsManagement implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'quantity', 'unit', 'categoryName', 'roomName', 'floorName', 'warehouseName', 'createdBy', 'actions'];
  dataSource = new MatTableDataSource<GoodsWrapper>();
  loading = false;
  isAdmin = false;
  today: Date = new Date();

  // Filtering
  warehouses: Warehouse[] = [];
  floors: FloorWrapper[] = [];
  rooms: RoomsWrapper[] = [];
  categories: GoodsCategory[] = [];

  selectedWarehouseId: number | null = null;
  selectedFloorId: number | null = null;
  selectedRoomId: number | null = null;

  selectedWarehouseName: string = 'All Warehouses';
  selectedFloorName: string = 'All Floors';
  selectedRoomName: string = 'All Rooms';

  constructor(
    private dialog: MatDialog,
    private goodsService: GoodsService,
    private categoryService: CategoryService,
    private warehouseService: WarehouseService,
    private floorsService: FloorsService,
    private roomsService: RoomsService,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadWarehouses();
    this.loadCategories();
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
        this.toastr.error('Failed to load warehouses', 'Error');
        this.setupRouteListener();
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('Failed to load categories', 'Error');
      }
    });
  }

  setupRouteListener(): void {
    this.route.params.subscribe(params => {
      const warehouseId = params['warehouseId'];
      const floorId = params['floorId'];
      const roomId = params['roomId'];

      console.log('Route params:', params);

      // Reset selections based on route
      if (!warehouseId) {
        // No warehouse selected - show all goods
        this.selectedWarehouseId = null;
        this.selectedFloorId = null;
        this.selectedRoomId = null;
        this.floors = [];
        this.rooms = [];
        this.updateSelectionNames();
        this.loadAllGoodsAndUpdateRoute();
      } else if (warehouseId && !floorId) {
        // Only warehouse selected
        this.selectedWarehouseId = parseInt(warehouseId);
        this.selectedFloorId = null;
        this.selectedRoomId = null;
        this.rooms = [];
        this.updateSelectionNames();
        this.loadFloorsByWarehouse(this.selectedWarehouseId);
        this.loadGoodsByWarehouseAndUpdateRoute(this.selectedWarehouseId);
      } else if (warehouseId && floorId && !roomId) {
        // Warehouse and floor selected
        this.selectedWarehouseId = parseInt(warehouseId);
        this.selectedFloorId = parseInt(floorId);
        this.selectedRoomId = null;
        this.updateSelectionNames();
        this.loadFloorsByWarehouse(this.selectedWarehouseId);
        this.loadRoomsByFloor(this.selectedWarehouseId, this.selectedFloorId);
        this.loadGoodsByFloorAndUpdateRoute(this.selectedWarehouseId, this.selectedFloorId);
      } else if (warehouseId && floorId && roomId) {
        // All three selected
        this.selectedWarehouseId = parseInt(warehouseId);
        this.selectedFloorId = parseInt(floorId);
        this.selectedRoomId = parseInt(roomId);
        this.updateSelectionNames();
        this.loadFloorsByWarehouse(this.selectedWarehouseId);
        this.loadRoomsByFloor(this.selectedWarehouseId, this.selectedFloorId);
        this.loadGoodsByRoomAndUpdateRoute(this.selectedWarehouseId, this.selectedFloorId, this.selectedRoomId);
      }
    });
  }

  updateSelectionNames(): void {
    // Update warehouse name
    if (this.selectedWarehouseId) {
      const warehouse = this.warehouses.find(w => w.id === this.selectedWarehouseId);
      this.selectedWarehouseName = warehouse ? warehouse.name : `Warehouse ${this.selectedWarehouseId}`;
    } else {
      this.selectedWarehouseName = 'All Warehouses';
    }

    // Update floor name
    if (this.selectedFloorId) {
      const floor = this.floors.find(f => f.id === this.selectedFloorId);
      this.selectedFloorName = floor ? floor.name : `Floor ${this.selectedFloorId}`;
    } else {
      this.selectedFloorName = 'All Floors';
    }

    // Update room name
    if (this.selectedRoomId) {
      const room = this.rooms.find(r => r.id === this.selectedRoomId);
      this.selectedRoomName = room ? room.name : `Room ${this.selectedRoomId}`;
    } else {
      this.selectedRoomName = 'All Rooms';
    }
  }

  loadFloorsByWarehouse(warehouseId: number): void {
    this.floorsService.getFloorsByWarehouseId(warehouseId).subscribe({
      next: (floors) => {
        this.floors = floors;
        this.updateSelectionNames();
      },
      error: (error) => {
        console.error('Error loading floors:', error);
        this.toastr.error('Failed to load floors', 'Error');
        this.floors = [];
      }
    });
  }

  loadRoomsByFloor(warehouseId: number, floorId: number): void {
    this.roomsService.getRoomsByFloorAndWarehouse(floorId, warehouseId).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.updateSelectionNames();
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.toastr.error('Failed to load rooms', 'Error');
        this.rooms = [];
      }
    });
  }

  // Navigation methods that update URL
  navigateToAllGoods(): void {
    this.router.navigate(['/super-admin/goods/all']);
  }

  navigateToWarehouseGoods(warehouseId: number): void {
    this.router.navigate(['/super-admin/goods/warehouse', warehouseId]);
  }

  navigateToFloorGoods(warehouseId: number, floorId: number): void {
    this.router.navigate(['/super-admin/goods/warehouse', warehouseId, 'floor', floorId]);
  }

  navigateToRoomGoods(warehouseId: number, floorId: number, roomId: number): void {
    this.router.navigate(['/super-admin/goods/warehouse', warehouseId, 'floor', floorId, 'room', roomId]);
  }

  // Load methods that update state based on route
  loadAllGoodsAndUpdateRoute(): void {
    this.loading = true;
    console.log('Loading all goods');

    this.goodsService.getAllGoods().subscribe({
      next: (goods) => {
        this.dataSource.data = goods;
        this.loading = false;
        console.log('All goods loaded');
      },
      error: (error) => {
        console.error('Error loading all goods:', error);
        this.loading = false;
        this.toastr.error('Failed to load goods', 'Error');
      }
    });
  }

  loadGoodsByWarehouseAndUpdateRoute(warehouseId: number): void {
    this.loading = true;
    console.log('Loading goods for warehouse:', warehouseId);

    this.goodsService.getGoodsByWarehouse(warehouseId).subscribe({
      next: (goods) => {
        this.dataSource.data = goods;
        this.loading = false;
        console.log('Goods by warehouse loaded');
      },
      error: (error) => {
        console.error('Error loading goods by warehouse:', error);
        this.loading = false;
        this.toastr.error('Failed to load goods', 'Error');
      }
    });
  }

  loadGoodsByFloorAndUpdateRoute(warehouseId: number, floorId: number): void {
    this.loading = true;
    console.log('Loading goods for floor:', floorId, 'in warehouse:', warehouseId);

    this.goodsService.getGoodsByFloor(floorId).subscribe({
      next: (goods) => {
        this.dataSource.data = goods;
        this.loading = false;
        console.log('Goods by floor loaded');
      },
      error: (error) => {
        console.error('Error loading goods by floor:', error);
        this.loading = false;
        this.toastr.error('Failed to load goods', 'Error');
      }
    });
  }

  loadGoodsByRoomAndUpdateRoute(warehouseId: number, floorId: number, roomId: number): void {
    this.loading = true;
    console.log('Loading goods for room:', roomId, 'in floor:', floorId, 'warehouse:', warehouseId);

    this.goodsService.getGoodsByRoom(roomId).subscribe({
      next: (goods) => {
        this.dataSource.data = goods;
        this.loading = false;
        console.log('Goods by room loaded');
      },
      error: (error) => {
        console.error('Error loading goods by room:', error);
        this.loading = false;
        this.toastr.error('Failed to load goods', 'Error');
      }
    });
  }

  // Button click handlers
  showAllGoods(): void {
    this.navigateToAllGoods();
  }

  showGoodsByWarehouse(warehouseId: number): void {
    this.navigateToWarehouseGoods(warehouseId);
  }

  showGoodsByFloor(floorId: number): void {
    if (this.selectedWarehouseId) {
      this.navigateToFloorGoods(this.selectedWarehouseId, floorId);
    }
  }

  showGoodsByRoom(roomId: number): void {
    if (this.selectedWarehouseId && this.selectedFloorId) {
      this.navigateToRoomGoods(this.selectedWarehouseId, this.selectedFloorId, roomId);
    }
  }

  openAddGoodsDialog(): void {
    const dialogRef = this.dialog.open(CreateGoods, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        warehouses: this.warehouses,
        categories: this.categories
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadBasedOnCurrentRoute();
      }
    });
  }

  editGoods(goods: GoodsWrapper): void {
    this.goodsService.getGoodsById(goods.id).subscribe({
      next: (goodsDetail) => {
        const dialogRef = this.dialog.open(CreateGoods, {
          width: '90vw',
          maxWidth: '600px',
          maxHeight: '90vh',
          disableClose: true,
          data: {
            goods: goodsDetail,
            warehouses: this.warehouses,
            categories: this.categories
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.reloadBasedOnCurrentRoute();
          }
        });
      },
      error: (error) => {
        console.error('Error loading goods details:', error);
        this.toastr.error('Failed to load goods details', 'Error');
      }
    });
  }

  deleteGoods(goods: GoodsWrapper): void {
    if (confirm(`Are you sure you want to delete "${goods.name}"?`)) {
      this.goodsService.deleteGoods(goods.id).subscribe({
        next: (response: string) => {
          this.toastr.success('Goods deleted successfully!', 'Success');
          this.reloadBasedOnCurrentRoute();
        },
        error: (error) => {
          console.error('Error deleting goods:', error);
          let errorMessage = 'Error deleting goods';

          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized - Please check your permissions';
          } else if (error.status === 403) {
            errorMessage = 'Forbidden - You do not have permission to delete goods';
          } else if (error.status === 404) {
            errorMessage = 'Goods not found';
          }

          this.toastr.error(errorMessage, 'Error');
        }
      });
    }
  }

  private reloadBasedOnCurrentRoute(): void {
    if (this.selectedRoomId && this.selectedFloorId && this.selectedWarehouseId) {
      this.loadGoodsByRoomAndUpdateRoute(this.selectedWarehouseId, this.selectedFloorId, this.selectedRoomId);
    } else if (this.selectedFloorId && this.selectedWarehouseId) {
      this.loadGoodsByFloorAndUpdateRoute(this.selectedWarehouseId, this.selectedFloorId);
    } else if (this.selectedWarehouseId) {
      this.loadGoodsByWarehouseAndUpdateRoute(this.selectedWarehouseId);
    } else {
      this.loadAllGoodsAndUpdateRoute();
    }
  }
}