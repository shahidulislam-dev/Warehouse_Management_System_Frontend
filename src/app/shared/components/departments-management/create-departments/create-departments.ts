import { Component, Inject } from '@angular/core';
import { DepartmentsResponse, DepartmentsService } from '../../../../services/departments-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalToastrService } from '../../../../services/global-toastr-service';
export interface CreateDepartmentData {
  department?: DepartmentsResponse;
}
@Component({
  selector: 'app-create-departments',
  standalone: false,
  templateUrl: './create-departments.html',
  styleUrl: './create-departments.css'
})
export class CreateDepartments {
departmentForm: FormGroup;
  isEdit = false;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CreateDepartments>,
    @Inject(MAT_DIALOG_DATA) public data: CreateDepartmentData,
    private fb: FormBuilder,
    private departmentsService: DepartmentsService,
    private toastr: GlobalToastrService
  ) {
    this.isEdit = !!data.department;
    
    this.departmentForm = this.fb.group({
      departmentName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });

    if (this.isEdit && data.department) {
      this.departmentForm.patchValue({
        departmentName: data.department.departmentName
      });
    }
  }

  onSubmit(): void {
    if (this.departmentForm.valid) {
      this.loading = true;
      const formValue = this.departmentForm.value;
      
      const request = {
        departmentName: formValue.departmentName.trim()
      };

      const operation = this.isEdit && this.data.department
        ? this.departmentsService.updateDepartment(this.data.department.id, request)
        : this.departmentsService.createDepartment(request);

      operation.subscribe({
        next: (response: string) => {
          this.toastr.success(`Department ${this.isEdit ? 'updated' : 'created'} successfully!`);
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error(`Error ${this.isEdit ? 'updating' : 'creating'} department:`, error);
          this.loading = false;
          
          let errorMessage = this.isEdit ? 'Error updating department' : 'Error creating department';
          
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
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

  hasError(controlName: string, errorName: string): boolean {
    const control = this.departmentForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.departmentForm.controls).forEach(key => {
      const control = this.departmentForm.get(key);
      control?.markAsTouched();
    });
  }
}