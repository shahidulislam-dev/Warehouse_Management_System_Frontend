import { Component, Inject, OnInit } from '@angular/core';
import { Warehouse, WarehouseService } from '../../../../services/warehouse-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FloorRequest, FloorsService, FloorWrapper } from '../../../../services/floors-service';
@Component({
  selector: 'app-create-floor',
  standalone: false,
  templateUrl: './create-floor.html',
  styleUrl: './create-floor.css'
})
export class CreateFloor implements OnInit {
  floorForm: FormGroup;
  isEdit = false;
  loading = false;
  warehouses: Warehouse[] = [];

  constructor(
    private fb: FormBuilder,
    private floorsService: FloorsService,
    public dialogRef: MatDialogRef<CreateFloor>,
    @Inject(MAT_DIALOG_DATA) public data: { floor: FloorWrapper, warehouses: Warehouse[] },
    private toastr: ToastrService
  ) {
    this.isEdit = !!data?.floor;
    this.warehouses = data.warehouses || [];
    
    this.floorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      warehouseId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.floor) {
      // Find warehouse ID by name for editing
      const warehouse = this.warehouses.find(w => w.name === this.data.floor.warehouseName);
      this.floorForm.patchValue({
        name: this.data.floor.name,
        warehouseId: warehouse?.id || ''
      });
    }
  }

  onSubmit(): void {
    if (this.floorForm.valid) {
      this.loading = true;
      const request: FloorRequest = {
        name: this.floorForm.value.name.trim(),
        warehouseId: this.floorForm.value.warehouseId
      };

      console.log('Submitting floor form:', {
        isEdit: this.isEdit,
        floorId: this.isEdit ? this.data.floor.id : null,
        request: request
      });

      const operation = this.isEdit 
        ? this.floorsService.updateFloor(this.data.floor.id, request)
        : this.floorsService.createFloor(request);

      operation.subscribe({
        next: (response: string) => {
          console.log('Floor operation successful:', response);
          this.loading = false;
          
          this.toastr.success(
            `Floor ${this.isEdit ? 'updated' : 'created'} successfully!`,
            'Success'
          );
          
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving floor:', error);
          this.loading = false;
          
          let errorMessage = this.isEdit ? 'Error updating floor' : 'Error creating floor';
          
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized - Please check your permissions';
          } else if (error.status === 403) {
            errorMessage = 'Forbidden - You do not have permission to perform this action';
          } else if (error.status === 404) {
            errorMessage = 'Warehouse not found';
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
