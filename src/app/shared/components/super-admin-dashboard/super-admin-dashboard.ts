import { FloorsService } from './../../../services/floors-service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { WarehouseService } from '../../../services/warehouse-service';
import { UserService } from '../../../services/user-service';
import { RoomsService } from '../../../services/rooms-service';
import { GoodsService } from '../../../services/goods-service';
import { EventsService } from '../../../services/events-service';
import { DepartmentsService } from '../../../services/departments-service';
import { TransactionsService } from '../../../services/transactions-service';
import { Router } from '@angular/router';
import { GlobalToastrService } from '../../../services/global-toastr-service';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: false,
  templateUrl: './super-admin-dashboard.html',
  styleUrl: './super-admin-dashboard.css'
})
export class SuperAdminDashboard implements OnInit {
  userCount: number = 0;
  warehouseCount: number = 0;
  floorCount: number = 0;
  roomCount: number = 0;
  goodsCount: number = 0;
  eventCount: number = 0;
  departmentCount: number = 0;
  transactionCount: number = 0;
  pendingApprovals: number = 0;
  isLoading = true;

  constructor(
    public authService: AuthService,
    private warehouseService: WarehouseService,
    private floorService: FloorsService,
    private roomsService: RoomsService,
    private goodsService: GoodsService,
    private eventsService: EventsService,
    private departmentsService: DepartmentsService,
    private transactionsService: TransactionsService,
    private userService: UserService,
    private router: Router,
    private toastr: GlobalToastrService 
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load users data (only for admin/super-admin)
    if (this.authService.canManageUsers()) {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.userCount = users.length;
          this.pendingApprovals = users.filter((user: any) => user.status === 'false').length;
        },
        error: (error) => {
          console.error('Error loading users:', error);
        }
      });
    }

    // Load warehouses
    this.warehouseService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouseCount = warehouses.length;
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
      }
    });

    // Load floors
    this.floorService.getAllFloors().subscribe({
      next: (floors) => {
        this.floorCount = floors.length;
      },
      error: (error) => {
        console.error('Error loading floors:', error);
      }
    });

    // Load rooms
    this.roomsService.getAllRooms().subscribe({
      next: (rooms) => {
        this.roomCount = rooms.length;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
      }
    });

    // Load goods
    this.goodsService.getAllGoods().subscribe({
      next: (goods) => {
        this.goodsCount = goods.length;
      },
      error: (error) => {
        console.error('Error loading goods:', error);
      }
    });

    // Load events
    this.eventsService.getAllEvents().subscribe({
      next: (events) => {
        this.eventCount = events.length;
      },
      error: (error) => {
        console.error('Error loading events:', error);
      }
    });

    // Load departments
    this.departmentsService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departmentCount = departments.length;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });

    // Load transactions
    this.transactionsService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactionCount = transactions.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.isLoading = false;
      }
    });
  }

  getDashboardRoute(): string {
    return this.authService.getDashboardRoute();
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}