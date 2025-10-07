import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Warehouse } from '../../../../services/warehouse-service';
import { FloorsService, FloorWrapper } from '../../../../services/floors-service';
import { RoomRequest, RoomsService, RoomsWrapper } from '../../../../services/rooms-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-room',
  standalone: false,
  templateUrl: './create-room.html',
  styleUrl: './create-room.css'
})
export class CreateRoom implements OnInit {
  roomForm: FormGroup;
  isEdit = false;
  loading = false;
  warehouses: Warehouse[] = [];
  floors: FloorWrapper[] = [];

  constructor(
    private fb: FormBuilder,
    private roomsService: RoomsService,
    private floorsService: FloorsService,
    public dialogRef: MatDialogRef<CreateRoom>,
    @Inject(MAT_DIALOG_DATA) public data: { room: RoomsWrapper, warehouses: Warehouse[], floors: FloorWrapper[] },
    private toastr: ToastrService
  ) {
    this.isEdit = !!data?.room;
    this.warehouses = data.warehouses || [];
    this.floors = data.floors || [];
    
    this.roomForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      warehouseId: ['', [Validators.required]],
      floorId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.room) {
      // For editing, we need to find the warehouse and floor IDs
      const warehouse = this.warehouses.find(w => w.name === this.data.room.warehouseName);
      const floor = this.floors.find(f => f.name === this.data.room.floorName);
      
      if (warehouse) {
        this.onWarehouseChange(warehouse.id);
      }
      
      this.roomForm.patchValue({
        name: this.data.room.name,
        warehouseId: warehouse?.id || '',
        floorId: floor?.id || ''
      });
    }
  }

  onWarehouseChange(warehouseId: number): void {
    this.roomForm.get('floorId')?.setValue('');
    this.floorsService.getFloorsByWarehouseId(warehouseId).subscribe({
      next: (floors) => {
        this.floors = floors;
      },
      error: (error) => {
        console.error('Error loading floors:', error);
        this.floors = [];
      }
    });
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      this.loading = true;
      const request: RoomRequest = {
        name: this.roomForm.value.name.trim(),
        floorId: this.roomForm.value.floorId
      };

      const operation = this.isEdit 
        ? this.roomsService.updateRoom(this.data.room.id, request)
        : this.roomsService.createRoom(request);

      operation.subscribe({
        next: (response: string) => {
          console.log('Room operation successful:', response);
          this.loading = false;
          
          this.toastr.success(
            `Room ${this.isEdit ? 'updated' : 'created'} successfully!`,
            'Success'
          );
          
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving room:', error);
          this.loading = false;
          
          let errorMessage = this.isEdit ? 'Error updating room' : 'Error creating room';
          
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized - Please check your permissions';
          } else if (error.status === 403) {
            errorMessage = 'Forbidden - You do not have permission to perform this action';
          } else if (error.status === 404) {
            errorMessage = 'Floor not found';
          }
          
          this.toastr.error(errorMessage, 'Error');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}