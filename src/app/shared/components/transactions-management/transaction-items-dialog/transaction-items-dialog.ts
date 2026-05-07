// transaction-items-dialog/transaction-items-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionResponse } from '../../../../services/transactions-service';

@Component({
  selector: 'app-transaction-items-dialog',
  standalone: false,
  templateUrl: './transaction-items-dialog.html'
})
export class TransactionItemsDialog {
  constructor(
    public dialogRef: MatDialogRef<TransactionItemsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: TransactionResponse }
  ) {}
}