import { Component, Inject, OnInit } from '@angular/core';
import { Warehouse, WarehouseRequest, WarehouseService } from '../../../../services/warehouse-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalToastrService } from '../../../../services/global-toastr-service';

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
    private toastr: GlobalToastrService 
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
      
      const operation = this.isEdit 
        ? this.warehouseService.updateWarehouse(this.data.warehouse.id, request)
        : this.warehouseService.createWarehouse(request);

      operation.subscribe({
        next: (response: string) => {
          this.loading = false;
          
          // Use global toastr service - much cleaner!
          this.toastr.success(
            `Warehouse ${this.isEdit ? 'updated' : 'created'} successfully!`
          );
          
          this.dialogRef.close(true);
        },
        error: (error) => {
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

          // Use global toastr service for errors
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}