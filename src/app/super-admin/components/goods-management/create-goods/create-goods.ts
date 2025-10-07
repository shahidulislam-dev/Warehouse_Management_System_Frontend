// components/goods-management/create-goods/create-goods.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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

  // Common units for selection
  units: string[] = [
    'Piece', 'Box', 'Packet', 'Bundle', 'Set',
    'Kg', 'Gram', 'Pound', 'Ounce',
    'Liter', 'Milliliter', 'Gallon',
    'Meter', 'Centimeter', 'Foot', 'Inch',
    'Carton', 'Pallet', 'Container'
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateGoods>,
    @Inject(MAT_DIALOG_DATA) public data: CreateGoodsData,
    private fb: FormBuilder,
    private goodsService: GoodsService,
    private floorsService: FloorsService,
    private roomsService: RoomsService,
    private toastr: ToastrService
  ) {
    this.isEdit = !!data.goods;
    
    this.goodsForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      quantity: ['', [Validators.required, Validators.min(0), Validators.max(999999)]],
      unit: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      warehouseId: ['', [Validators.required]],
      floorId: ['', [Validators.required]],
      roomId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.goods) {
      this.patchFormWithGoodsData();
    }

    // Load floors and rooms when warehouse changes
    this.goodsForm.get('warehouseId')?.valueChanges.subscribe(warehouseId => {
      if (warehouseId) {
        this.loadFloorsByWarehouse(warehouseId);
      } else {
        this.floors = [];
        this.rooms = [];
        this.goodsForm.patchValue({ floorId: '', roomId: '' });
      }
    });

    // Load rooms when floor changes
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

  patchFormWithGoodsData(): void {
    if (this.data.goods) {
      // For edit mode, we'll populate the basic fields
      // The location fields will be populated after we load the related data
      this.goodsForm.patchValue({
        name: this.data.goods.name,
        quantity: this.data.goods.quantity,
        unit: this.data.goods.unit,
        categoryId: this.findCategoryIdByName(this.data.goods.categoryName)
      });

      // Note: For a complete edit implementation, you would need to:
      // 1. Find the warehouse by name and set warehouseId
      // 2. Load floors for that warehouse
      // 3. Find the floor by name and set floorId
      // 4. Load rooms for that floor
      // 5. Find the room by name and set roomId
      // This requires additional API calls and is more complex
    }
  }

  findCategoryIdByName(categoryName: string): number {
    const category = this.data.categories.find(c => c.name === categoryName);
    return category ? category.id : 0;
  }

  loadFloorsByWarehouse(warehouseId: number): void {
    this.floorsService.getFloorsByWarehouseId(warehouseId).subscribe({
      next: (floors) => {
        this.floors = floors;
        // If editing and we have floor data, try to find and set the floor
        if (this.isEdit && this.data.goods) {
          const floor = this.floors.find(f => f.name === this.data.goods?.floorName);
          if (floor) {
            this.goodsForm.patchValue({ floorId: floor.id });
          }
        }
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
        // If editing and we have room data, try to find and set the room
        if (this.isEdit && this.data.goods) {
          const room = this.rooms.find(r => r.name === this.data.goods?.roomName);
          if (room) {
            this.goodsForm.patchValue({ roomId: room.id });
          }
        }
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.toastr.error('Failed to load rooms', 'Error');
        this.rooms = [];
      }
    });
  }

  onSubmit(): void {
    if (this.goodsForm.valid) {
      this.loading = true;
      const formValue = this.goodsForm.value;

      const request: GoodsRequest = {
        name: formValue.name.trim(),
        quantity: formValue.quantity,
        unit: formValue.unit,
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
          this.toastr.success(
            `Goods ${this.isEdit ? 'updated' : 'created'} successfully!`,
            'Success'
          );
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
          
          this.toastr.error(errorMessage, 'Error');
        }
      });
    } else {
      this.markFormGroupTouched();
      this.toastr.error('Please fill all required fields correctly', 'Validation Error');
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

  // Helper method to check if field has error
  hasError(controlName: string, errorName: string): boolean {
    const control = this.goodsForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }
}
