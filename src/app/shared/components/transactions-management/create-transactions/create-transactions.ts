// create-transactions/create-transactions.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionsService } from '../../../../services/transactions-service';
import { GlobalToastrService } from '../../../../services/global-toastr-service';

@Component({
  selector: 'app-create-transactions',
  standalone: false,
  templateUrl: './create-transactions.html',
  styleUrl: './create-transactions.css'
})
export class CreateTransactions {
  transactionType: string = 'NORMAL';
  approvedBy: string = '';
  
  // Normal fields
  receiverName: string = '';
  receiverContact: string = '';
  receiverDutyPlace: string = '';
  
  // Event fields
  selectedEventId: number | null = null;
  selectedDepartmentId: number | null = null;
  eventReceiverName: string = '';
  eventReceiverContact: string = '';
  
  // Item selection
  selectedGoodsId: number | null = null;
  selectedQuantity: number = 1;
  items: { goodsId: number; quantity: number }[] = [];
  
  isEdit: boolean = false;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateTransactions>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transactionsService: TransactionsService,
    private toastr: GlobalToastrService
  ) {
    this.isEdit = data.isEdit || false;
    if (this.isEdit && data.transaction) {
      this.loadTransactionData();
    }
  }

  loadTransactionData(): void {
    const tx = this.data.transaction;
    this.transactionType = tx.transactionCategory;
    this.approvedBy = tx.approvedBy;
    this.receiverName = tx.receiverName;
    this.receiverContact = tx.receiverContact;
    this.receiverDutyPlace = tx.receiverDutyPlace;
    this.selectedEventId = tx.eventId;
    this.selectedDepartmentId = tx.departmentId;
    this.eventReceiverName = tx.eventReceiverName;
    this.eventReceiverContact = tx.eventReceiverContact;
    
    if (tx.items) {
      this.items = tx.items.map((i: any) => ({ goodsId: i.goodsId, quantity: i.quantity }));
    }
  }

  addItem(): void {
    if (!this.selectedGoodsId || !this.selectedQuantity || this.selectedQuantity < 1) {
      this.toastr.warning('Please select goods and quantity');
      return;
    }

    const existing = this.items.find(i => i.goodsId === this.selectedGoodsId);
    if (existing) {
      existing.quantity += this.selectedQuantity;
    } else {
      this.items.push({ goodsId: this.selectedGoodsId, quantity: this.selectedQuantity });
    }
    
    this.selectedGoodsId = null;
    this.selectedQuantity = 1;
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  getGoodsName(goodsId: number): string {
    const goods = this.data.goods?.find((g: any) => g.id === goodsId);
    return goods ? goods.name : 'Unknown';
  }

  getGoodsUnit(goodsId: number): string {
    const goods = this.data.goods?.find((g: any) => g.id === goodsId);
    return goods ? goods.categoryUnit : '';
  }

  getAvailableQuantity(goodsId: number): number {
    const goods = this.data.goods?.find((g: any) => g.id === goodsId);
    return goods ? goods.quantity : 0;
  }

  onSubmit(): void {
    if (this.items.length === 0) {
      this.toastr.error('Please add at least one item');
      return;
    }

    const request: any = {
      transactionCategory: this.transactionType,
      approvedBy: this.approvedBy,
      items: this.items
    };

    if (this.transactionType === 'NORMAL') {
      if (!this.receiverName || !this.receiverContact || !this.receiverDutyPlace) {
        this.toastr.error('Please fill all receiver details');
        return;
      }
      request.receiverName = this.receiverName;
      request.receiverContact = this.receiverContact;
      request.receiverDutyPlace = this.receiverDutyPlace;
    } else {
      if (!this.selectedEventId || !this.selectedDepartmentId || !this.eventReceiverName || !this.eventReceiverContact) {
        this.toastr.error('Please fill all event details');
        return;
      }
      request.eventId = this.selectedEventId;
      request.departmentId = this.selectedDepartmentId;
      request.eventReceiverName = this.eventReceiverName;
      request.eventReceiverContact = this.eventReceiverContact;
    }

    this.loading = true;
    const operation = this.isEdit
      ? this.transactionsService.updateTransaction(this.data.transaction.id, request)
      : this.transactionsService.createTransaction(request);

    operation.subscribe({
      next: () => {
        this.toastr.success(`Transaction ${this.isEdit ? 'updated' : 'created'}!`);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastr.error(typeof err.error === 'string' ? err.error : 'Error saving transaction');
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}