import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Warehouse } from '../../../../services/warehouse-service';
import { FloorsService, FloorWrapper } from '../../../../services/floors-service';
import { RoomRequest, RoomsService, RoomsWrapper } from '../../../../services/rooms-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalToastrService } from '../../../../services/global-toastr-service';

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
    private toastr: GlobalToastrService
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
      this.initializeEditMode();
    }
  }

  private initializeEditMode(): void {
    if (!this.data.room) return;

    // Set the name field immediately
    this.roomForm.patchValue({
      name: this.data.room.name
    });

    // Find warehouse by name from the available warehouses
    const warehouse = this.warehouses.find(w => w.name === this.data.room.warehouseName);
    if (warehouse) {
      // Set warehouse and load floors for this warehouse
      this.roomForm.patchValue({ warehouseId: warehouse.id });
      this.loadFloorsForEdit(warehouse.id);
    } else {
      this.toastr.error('Associated warehouse not found');
    }
  }

  private loadFloorsForEdit(warehouseId: number): void {
    this.floorsService.getFloorsByWarehouseId(warehouseId).subscribe({
      next: (floors) => {
        this.floors = floors;
        
        // Find floor by name from the loaded floors
        const floor = this.floors.find(f => f.name === this.data.room?.floorName);
        if (floor) {
          // Set the floor field
          this.roomForm.patchValue({ floorId: floor.id });
        } else {
          this.toastr.error('Associated floor not found');
        }
      },
      error: (error) => {
        console.error('Error loading floors:', error);
        this.toastr.error('Failed to load floors for selected warehouse');
        this.floors = [];
      }
    });
  }

  onWarehouseChange(warehouseId: number): void {
    // Only reset floorId if we're not in edit mode or if the warehouse actually changed
    if (!this.isEdit || this.roomForm.get('warehouseId')?.value !== warehouseId) {
      this.roomForm.get('floorId')?.setValue('');
    }
    
    this.floorsService.getFloorsByWarehouseId(warehouseId).subscribe({
      next: (floors) => {
        this.floors = floors;
        
        // In edit mode, if we have a floor already selected, try to maintain it
        if (this.isEdit && this.data.room) {
          const floor = this.floors.find(f => f.name === this.data.room?.floorName);
          if (floor) {
            this.roomForm.patchValue({ floorId: floor.id });
          }
        }
      },
      error: (error) => {
        console.error('Error loading floors:', error);
        this.floors = [];
        this.toastr.error('Failed to load floors for selected warehouse');
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
          this.loading = false;
          this.toastr.success(`Room ${this.isEdit ? 'updated' : 'created'} successfully!`);
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
          
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}