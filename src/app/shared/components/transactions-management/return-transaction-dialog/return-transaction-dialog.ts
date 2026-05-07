// return-transaction-dialog/return-transaction-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionsService, TransactionResponse, TransactionItemResponse } from '../../../../services/transactions-service';
import { GlobalToastrService } from '../../../../services/global-toastr-service';

@Component({
  selector: 'app-return-transaction-dialog',
  standalone: false,
  templateUrl: './return-transaction-dialog.html',
  styleUrl: './return-transaction-dialog.css'
})
export class ReturnTransactionDialog {
  transaction: TransactionResponse;
  returnItems: { transactionItemId: number; quantityReturned: number; goodsName: string; unit: string; issued: number; returned: number }[] = [];
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ReturnTransactionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: TransactionResponse },
    private transactionsService: TransactionsService,
    private toastr: GlobalToastrService
  ) {
    this.transaction = data.transaction;
    
    // Initialize return items from transaction items that are still ISSUED
    this.returnItems = this.transaction.items
      .filter(item => item.status === 'ISSUED')
      .map(item => ({
        transactionItemId: item.id,
        quantityReturned: 0,
        goodsName: item.goodsName,
        unit: item.unit,
        issued: item.quantity,
        returned: item.quantityReturned
      }));
  }

  getMaxReturn(item: any): number {
    return item.issued - item.returned;
  }

  onSubmit(): void {
    const itemsToReturn = this.returnItems
      .filter(item => item.quantityReturned > 0)
      .map(item => ({
        transactionItemId: item.transactionItemId,
        quantityReturned: item.quantityReturned
      }));

    if (itemsToReturn.length === 0) {
      this.toastr.warning('Please enter quantity for at least one item');
      return;
    }

    this.loading = true;
    this.transactionsService.returnTransaction({
      transactionId: this.transaction.id,
      items: itemsToReturn
    }).subscribe({
      next: () => {
        this.toastr.success('Materials returned successfully!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastr.error(typeof err.error === 'string' ? err.error : 'Error returning materials');
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}