import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionsService, TransactionRequest } from '../../../../services/transactions-service';
import { EventsResponse } from '../../../../services/events-service';
import { DepartmentsResponse } from '../../../../services/departments-service';
import { GoodsWrapper } from '../../../../services/goods-service';
import { GlobalToastrService } from '../../../../services/global-toastr-service';
export interface CreateTransactionData {
  events: EventsResponse[];
  departments: DepartmentsResponse[];
  goods: GoodsWrapper[];
}
@Component({
  selector: 'app-create-transactions',
  standalone: false,
  templateUrl: './create-transactions.html',
  styleUrl: './create-transactions.css'
})
export class CreateTransactions implements OnInit {
  transactionForm: FormGroup;
  loading = false;
  isEventTransaction = false;

  constructor(
    public dialogRef: MatDialogRef<CreateTransactions>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTransactionData,
    private fb: FormBuilder,
    private transactionsService: TransactionsService,
    private toastr: GlobalToastrService
  ) {
    this.transactionForm = this.fb.group({
      transactionCategory: ['NORMAL', [Validators.required]],
      approvedBy: ['', [Validators.required]],
      goodsId: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      
      // Normal transaction fields
      receiverName: [''],
      receiverContact: [''],
      receiverDutyPlace: [''],
      
      // Event transaction fields
      eventId: [''],
      departmentId: [''],
      eventReceiverName: [''],
      eventReceiverContact: ['']
    });
  }

  ngOnInit(): void {
    this.transactionForm.get('transactionCategory')?.valueChanges.subscribe(category => {
      this.isEventTransaction = category === 'EVENT';
      this.updateValidators();
    });
  }

  updateValidators(): void {
    const receiverName = this.transactionForm.get('receiverName');
    const receiverContact = this.transactionForm.get('receiverContact');
    const receiverDutyPlace = this.transactionForm.get('receiverDutyPlace');
    
    const eventId = this.transactionForm.get('eventId');
    const departmentId = this.transactionForm.get('departmentId');
    const eventReceiverName = this.transactionForm.get('eventReceiverName');
    const eventReceiverContact = this.transactionForm.get('eventReceiverContact');

    if (this.isEventTransaction) {
      receiverName?.clearValidators();
      receiverContact?.clearValidators();
      receiverDutyPlace?.clearValidators();
      
      eventId?.setValidators([Validators.required]);
      departmentId?.setValidators([Validators.required]);
      eventReceiverName?.setValidators([Validators.required]);
      eventReceiverContact?.setValidators([Validators.required]);
    } else {
      eventId?.clearValidators();
      departmentId?.clearValidators();
      eventReceiverName?.clearValidators();
      eventReceiverContact?.clearValidators();
      
      receiverName?.setValidators([Validators.required]);
      receiverContact?.setValidators([Validators.required]);
      receiverDutyPlace?.setValidators([Validators.required]);
    }

    receiverName?.updateValueAndValidity();
    receiverContact?.updateValueAndValidity();
    receiverDutyPlace?.updateValueAndValidity();
    eventId?.updateValueAndValidity();
    departmentId?.updateValueAndValidity();
    eventReceiverName?.updateValueAndValidity();
    eventReceiverContact?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.loading = true;
      const formValue = this.transactionForm.value;

      const request: TransactionRequest = {
        transactionCategory: formValue.transactionCategory,
        approvedBy: formValue.approvedBy.trim(),
        goodsId: formValue.goodsId,
        quantity: formValue.quantity,
        receiverName: formValue.receiverName?.trim() || '',
        receiverContact: formValue.receiverContact?.trim() || '',
        receiverDutyPlace: formValue.receiverDutyPlace?.trim() || '',
        eventId: formValue.eventId || null,
        departmentId: formValue.departmentId || null,
        eventReceiverName: formValue.eventReceiverName?.trim() || '',
        eventReceiverContact: formValue.eventReceiverContact?.trim() || ''
      };

      this.transactionsService.createTransaction(request).subscribe({
        next: (response: string) => {
          this.toastr.success('Transaction created successfully!');
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating transaction:', error);
          this.loading = false;
          
          let errorMessage = 'Error creating transaction';
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
    const control = this.transactionForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      control?.markAsTouched();
    });
  }
}
