// return-transaction-dialog/return-transaction-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionsService, TransactionResponse } from '../../../../services/transactions-service';
import { GlobalToastrService } from '../../../../services/global-toastr-service';

@Component({
  selector: 'app-return-transaction-dialog',
  standalone: false,
  templateUrl: './return-transaction-dialog.html'
})
export class ReturnTransactionDialog {
  transaction: TransactionResponse;
  returnItems: any[] = [];
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ReturnTransactionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: TransactionResponse },
    private transactionsService: TransactionsService,
    private toastr: GlobalToastrService
  ) {
    this.transaction = data.transaction;
    
    // ✅ Only show returnable items that still have remaining
    this.returnItems = this.transaction.items
      .filter(item => {
        // Skip non-returnable items completely
        if (item.returnableType === 'NON_RETURNABLE') return false;
        // Only show if remaining > 0
        const resolved = (item.quantityReturned || 0) + (item.quantityLost || 0);
        return item.quantity - resolved > 0;
      })
      .map(item => {
        const resolved = (item.quantityReturned || 0) + (item.quantityLost || 0);
        const remaining = item.quantity - resolved;
        const actualReturned = (item.quantityReturned || 0) - (item.quantityDamaged || 0);
        
        return {
          transactionItemId: item.id,
          goodsName: item.goodsName,
          unit: item.unit,
          issued: item.quantity,
          returned: actualReturned,
          damaged: item.quantityDamaged || 0,
          lost: item.quantityLost || 0,
          remaining: remaining,
          quantityReturned: 0,
          quantityDamaged: 0,
          quantityLost: 0,
          damagedDisabled: false,
          lostDisabled: false,
          notes: '',
          validationError: ''
        };
      });
  }

  onReturnChange(item: any): void {
    const returnQty = item.quantityReturned || 0;
    if (returnQty >= item.remaining) {
      item.damagedDisabled = true;
      item.lostDisabled = true;
      item.quantityDamaged = 0;
      item.quantityLost = 0;
    } else {
      item.damagedDisabled = false;
      item.lostDisabled = false;
      const currentOthers = (item.quantityDamaged || 0) + (item.quantityLost || 0);
      const remainingForOthers = item.remaining - returnQty;
      if (currentOthers > remainingForOthers) {
        item.quantityDamaged = 0;
        item.quantityLost = 0;
      }
    }
    this.validateItem(item);
  }

  onDamagedChange(item: any): void {
    const returnQty = item.quantityReturned || 0;
    const damagedQty = item.quantityDamaged || 0;
    const maxLost = item.remaining - returnQty - damagedQty;
    if (maxLost <= 0) {
      item.lostDisabled = true;
      item.quantityLost = 0;
    } else {
      item.lostDisabled = false;
      if ((item.quantityLost || 0) > maxLost) item.quantityLost = maxLost;
    }
    this.validateItem(item);
  }

  onLostChange(item: any): void {
    const returnQty = item.quantityReturned || 0;
    const lostQty = item.quantityLost || 0;
    const maxDamaged = item.remaining - returnQty - lostQty;
    if (maxDamaged <= 0) {
      item.damagedDisabled = true;
      item.quantityDamaged = 0;
    } else {
      item.damagedDisabled = false;
      if ((item.quantityDamaged || 0) > maxDamaged) item.quantityDamaged = maxDamaged;
    }
    this.validateItem(item);
  }

  validateItem(item: any): void {
    const total = (item.quantityReturned || 0) + (item.quantityDamaged || 0) + (item.quantityLost || 0);
    item.validationError = total > item.remaining ? `Total exceeds remaining.` : '';
  }

  onSubmit(): void {
    for (const item of this.returnItems) {
      const total = (item.quantityReturned || 0) + (item.quantityDamaged || 0) + (item.quantityLost || 0);
      if (total > item.remaining) {
        this.toastr.error(`Invalid quantity for "${item.goodsName}".`);
        return;
      }
    }

    const itemsToSubmit = this.returnItems
      .filter(item => (item.quantityReturned || 0) > 0 || (item.quantityDamaged || 0) > 0 || (item.quantityLost || 0) > 0)
      .map(item => ({
        transactionItemId: item.transactionItemId,
        quantityReturned: item.quantityReturned || 0,
        quantityDamaged: item.quantityDamaged || 0,
        quantityLost: item.quantityLost || 0,
        status: (item.quantityDamaged || 0) > 0 || (item.quantityLost || 0) > 0 ? 'DAMAGED' : 'RETURNED',
        notes: item.notes || ''
      }));

    if (itemsToSubmit.length === 0) {
      this.toastr.warning('Please enter quantity for at least one item');
      return;
    }

    this.loading = true;
    this.transactionsService.returnTransaction({
      transactionId: this.transaction.id,
      returnNotes: '',
      items: itemsToSubmit
    }).subscribe({
      next: () => { this.toastr.success('Transaction processed!'); this.dialogRef.close(true); },
      error: (err) => { this.toastr.error(typeof err.error === 'string' ? err.error : 'Error'); this.loading = false; }
    });
  }

  onCancel(): void { this.dialogRef.close(false); }
}