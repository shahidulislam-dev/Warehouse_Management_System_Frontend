import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalToastrService } from '../../../../services/global-toastr-service';
import { CategoryService, GoodsCategoryRequest, GoodsCategoryWrapper } from '../../../../services/category-service';

@Component({
  selector: 'app-create-category',
  standalone: false,
  templateUrl: './create-category.html',
  styleUrl: './create-category.css'
})
export class CreateCategory implements OnInit {
  categoryForm: FormGroup;
  isEdit = false;
  loading = false;

  // Add common units for selection
  units: string[] = [
    'Piece', 'Box', 'Packet', 'Bundle', 'Set',
    'Kg', 'Gram', 'Pound', 'Ounce',
    'Liter', 'Milliliter', 'Gallon',
    'Meter', 'Centimeter', 'Foot', 'Inch',
    'Carton', 'Pallet', 'Container', 'Unit'
  ];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CreateCategory>,
    @Inject(MAT_DIALOG_DATA) public data: { category: GoodsCategoryWrapper },
    private toastr: GlobalToastrService
  ) {
    this.isEdit = !!data?.category;
    
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      unit: ['', [Validators.required]] // Added unit field
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.category) {
      this.categoryForm.patchValue({
        name: this.data.category.name,
        unit: this.data.category.unit // Set unit for edit
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.loading = true;
      const request: GoodsCategoryRequest = {
        name: this.categoryForm.value.name.trim(),
        unit: this.categoryForm.value.unit // Include unit
      };

      const operation = this.isEdit 
        ? this.categoryService.updateCategory(this.data.category.id, request)
        : this.categoryService.createCategory(request);

      operation.subscribe({
        next: (response: any) => {
          this.loading = false;
          this.toastr.success(`Category ${this.isEdit ? 'updated' : 'created'} successfully!`);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving category:', error);
          this.loading = false;
          
          let errorMessage = this.isEdit ? 'Error updating category' : 'Error creating category';
          
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.toastr.error(errorMessage);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      control?.markAsTouched();
    });
  }
}