import { Component, Inject, OnInit } from '@angular/core';
import { Warehouse, WarehouseRequest, WarehouseService } from '../../../../services/warehouse-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-create-warehouse',
  standalone: false,
  templateUrl: './create-warehouse.html',
})
export class CreateWarehouse implements OnInit {
  warehouseForm: FormGroup;
  isEdit = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    public dialogRef: MatDialogRef<CreateWarehouse>,
    @Inject(MAT_DIALOG_DATA) public data: { warehouse: Warehouse },
    private toastr: ToastrService
  ) {
    this.isEdit = !!data?.warehouse;
    
    this.warehouseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.warehouse) {
      this.warehouseForm.patchValue({
        name: this.data.warehouse.name
      });
    }
  }

  onSubmit(): void {
    if (this.warehouseForm.valid) {
      this.loading = true;
      const request: WarehouseRequest = {
        name: this.warehouseForm.value.name.trim()
      };

      console.log('Submitting warehouse form:', {
        isEdit: this.isEdit,
        warehouseId: this.isEdit ? this.data.warehouse.id : null,
        request: request
      });

      const operation = this.isEdit 
        ? this.warehouseService.updateWarehouse(this.data.warehouse.id, request)
        : this.warehouseService.createWarehouse(request);

      operation.subscribe({
        next: (response: string) => {
          console.log('Warehouse operation successful:', response);
          this.loading = false;
          
          this.toastr.success(
            `Warehouse ${this.isEdit ? 'updated' : 'created'} successfully!`,
            'Success', { 
              timeOut: 3000,
              positionClass: 'toast-top-center'
            }



          );
          
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving warehouse:', error);
          this.loading = false;
          
          let errorMessage = this.isEdit ? 'Error updating warehouse' : 'Error creating warehouse';
          
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