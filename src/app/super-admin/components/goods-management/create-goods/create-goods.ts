import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalToastrService } from '../../../../services/global-toastr-service';
import { GoodsService, GoodsRequest, GoodsResponse } from '../../../../services/goods-service';
import { Warehouse } from '../../../../services/warehouse-service';
import { FloorsService, FloorWrapper } from '../../../../services/floors-service';
import { RoomsService, RoomsWrapper } from '../../../../services/rooms-service';
import { GoodsCategory } from '../../../../services/goods-service';

export interface CreateGoodsData {
  goods?: GoodsResponse;
  warehouses: Warehouse[];
  categories: GoodsCategory[];
}

@Component({
  selector: 'app-create-goods',
  standalone: false,
  templateUrl: './create-goods.html',
  styleUrl: './create-goods.css'
})
export class CreateGoods implements OnInit {
  goodsForm: FormGroup;
  isEdit = false;
  loading = false;

  floors: FloorWrapper[] = [];
  rooms: RoomsWrapper[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateGoods>,
    @Inject(MAT_DIALOG_DATA) public data: CreateGoodsData,
    private fb: FormBuilder,
    private goodsService: GoodsService,
    private floorsService: FloorsService,
    private roomsService: RoomsService,
    private toastr: GlobalToastrService
  ) {
    this.isEdit = !!data.goods;
    
    this.goodsForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      quantity: ['', [Validators.required, Validators.min(0), Validators.max(999999)]],
      // REMOVED: unit field - unit comes from category
      categoryId: ['', [Validators.required]],
      warehouseId: ['', [Validators.required]],
      floorId: ['', [Validators.required]],
      roomId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.goods) {
      this.initializeEditMode();
    }

    this.setupFormListeners();
  }

  private initializeEditMode(): void {
    if (!this.data.goods) return;

    this.goodsForm.patchValue({
      name: this.data.goods.name,
      quantity: this.data.goods.quantity,
      categoryId: this.findCategoryIdByName(this.data.goods.categoryName)
    });

    // Find and set warehouse by name
    const warehouse = this.data.warehouses.find(w => w.name === this.data.goods?.warehouseName);
    if (warehouse) {
      this.goodsForm.patchValue({ warehouseId: warehouse.id });
      this.loadFloorsForEdit(warehouse.id);
    }
  }

  private setupFormListeners(): void {
    this.goodsForm.get('warehouseId')?.valueChanges.subscribe(warehouseId => {
      if (warehouseId) {
        this.loadFloorsByWarehouse(warehouseId);
      } else {
        this.floors = [];
        this.rooms = [];
        this.goodsForm.patchValue({ floorId: '', roomId: '' });
      }
    });

    this.goodsForm.get('floorId')?.valueChanges.subscribe(floorId => {
      const warehouseId = this.goodsForm.get('warehouseId')?.value;
      if (warehouseId && floorId) {
        this.loadRoomsByFloor(warehouseId, floorId);
      } else {
        this.rooms = [];
        this.goodsForm.patchValue({ roomId: '' });
      }
    });
  }

  private loadFloorsForEdit(warehouseId: number): void {
    this.floorsService.getFloorsByWarehouseId(warehouseId).subscribe({
      next: (floors) => {
        this.floors = floors;
        
        // Find and set floor by name
        const floor = this.floors.find(f => f.name === this.data.goods?.floorName);
        if (floor) {
          this.goodsForm.patchValue({ floorId: floor.id });
          this.loadRoomsForEdit(warehouseId, floor.id);
        }
      },
      error: (error) => {
        console.error('Error loading floors:', error);
        this.toastr.error('Failed to load floors');
        this.floors = [];
      }
    });
  }

  private loadRoomsForEdit(warehouseId: number, floorId: number): void {
    this.roomsService.getRoomsByFloorAndWarehouse(floorId, warehouseId).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        
        // Find and set room by name
        const room = this.rooms.find(r => r.name === this.data.goods?.roomName);
        if (room) {
          this.goodsForm.patchValue({ roomId: room.id });
        }
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.toastr.error('Failed to load rooms');
        this.rooms = [];
      }
    });
  }

  private loadFloorsByWarehouse(warehouseId: number): void {
    this.floorsService.getFloorsByWarehouseId(warehouseId).subscribe({
      next: (floors) => {
        this.floors = floors;
      },
      error: (error) => {
        console.error('Error loading floors:', error);
        this.toastr.error('Failed to load floors');
        this.floors = [];
      }
    });
  }

  private loadRoomsByFloor(warehouseId: number, floorId: number): void {
    this.roomsService.getRoomsByFloorAndWarehouse(floorId, warehouseId).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.toastr.error('Failed to load rooms');
        this.rooms = [];
      }
    });
  }

  private findCategoryIdByName(categoryName: string): number {
    const category = this.data.categories.find(c => c.name === categoryName);
    return category ? category.id : 0;
  }

  onSubmit(): void {
    if (this.goodsForm.valid) {
      this.loading = true;
      const formValue = this.goodsForm.value;

      const request: GoodsRequest = {
        name: formValue.name.trim(),
        quantity: formValue.quantity,
        categoryId: formValue.categoryId,
        warehouseId: formValue.warehouseId,
        floorId: formValue.floorId,
        roomId: formValue.roomId
      };

      const operation = this.isEdit && this.data.goods
        ? this.goodsService.updateGoods(this.data.goods.id, request)
        : this.goodsService.createGoods(request);

      operation.subscribe({
        next: (response: string) => {
          this.toastr.success(`Goods ${this.isEdit ? 'updated' : 'created'} successfully!`);
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error(`Error ${this.isEdit ? 'updating' : 'creating'} goods:`, error);
          this.loading = false;
          
          let errorMessage = this.isEdit ? 'Error updating goods' : 'Error creating goods';
          
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized - Please check your permissions';
          } else if (error.status === 403) {
            errorMessage = 'Forbidden - You do not have permission to perform this action';
          } else if (error.status === 404) {
            errorMessage = this.isEdit ? 'Goods not found' : 'Required resource not found';
          }
          
          this.toastr.error(errorMessage);
        }
      });
    } else {
      this.markFormGroupTouched();
      this.toastr.error('Please fill all required fields correctly');
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.goodsForm.controls).forEach(key => {
      const control = this.goodsForm.get(key);
      control?.markAsTouched();
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.goodsForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }
}