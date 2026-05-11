// create-transactions/create-transactions.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
  
  // Contact validation
  contactError: string = '';
  eventContactError: string = '';
  
  // Event fields
  selectedEventId: number | null = null;
  selectedDepartmentId: number | null = null;
  eventReceiverName: string = '';
  eventReceiverContact: string = '';
  
  // Search text fields
  eventSearchText: string = '';
  deptSearchText: string = '';
  goodsSearchText: string = '';
  
  // Filtered lists
  filteredEvents: any[] = [];
  filteredDepartments: any[] = [];
  filteredGoods: any[] = [];
  
  // Goods selection
  selectedGoodsId: number | null = null;
  selectedQuantity: number = 1;
  selectedReturnableType: string = 'RETURNABLE';
  items: any[] = [];
  
  isEdit: boolean = false;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateTransactions>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transactionsService: TransactionsService,
    private toastr: GlobalToastrService
  ) {
    this.isEdit = data.isEdit || false;
    this.filteredEvents = data.events || [];
    this.filteredDepartments = data.departments || [];
    this.filteredGoods = data.goods || [];
    
    if (this.isEdit && data.transaction) {
      this.loadTransactionData();
    }
  }

  loadTransactionData(): void {
    const tx = this.data.transaction;
    this.transactionType = tx.transactionCategory || 'NORMAL';
    this.approvedBy = tx.approvedBy || '';
    this.receiverName = tx.receiverName || '';
    this.receiverContact = tx.receiverContact || '';
    this.receiverDutyPlace = tx.receiverDutyPlace || '';
    this.selectedEventId = tx.eventId || null;
    this.selectedDepartmentId = tx.departmentId || null;
    this.eventReceiverName = tx.eventReceiverName || '';
    this.eventReceiverContact = tx.eventReceiverContact || '';
    
    this.eventSearchText = tx.eventName || '';
    this.deptSearchText = tx.departmentName || '';
    
    if (tx.items) {
      this.items = tx.items.map((i: any) => ({
        goodsId: i.goodsId,
        quantity: i.quantity,
        returnableType: i.returnableType || 'RETURNABLE',
        goodsName: i.goodsName,
        unit: i.unit
      }));
    }
  }

  // ==================== CONTACT VALIDATION ====================
  
  /**
   * Only allow numbers
   */
  onContactKeyPress(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  /**
   * Validate Bangladesh phone number
   * Must be exactly 11 digits starting with valid prefixes
   */
  validateContact(contact: string): boolean {
    if (!contact) return false;
    const bdPhoneRegex = /^(017|016|019|018|013|014|015)\d{8}$/;
    return bdPhoneRegex.test(contact);
  }

  /**
   * Called when normal receiver contact changes
   */
  onContactChange(): void {
    // Auto-remove non-numeric characters
    this.receiverContact = this.receiverContact?.replace(/[^0-9]/g, '');
    
    if (!this.receiverContact) {
      this.contactError = '';
      return;
    }
    
    if (this.receiverContact.length > 11) {
      this.receiverContact = this.receiverContact.substring(0, 11);
    }
    
    if (this.receiverContact.length === 11) {
      if (!this.validateContact(this.receiverContact)) {
        this.contactError = 'Must start with 017, 016, 019, 018, 013, 014, or 015';
      } else {
        this.contactError = '';
      }
    } else if (this.receiverContact.length > 0 && this.receiverContact.length < 11) {
      this.contactError = 'Contact must be exactly 11 digits';
    } else {
      this.contactError = '';
    }
  }

  /**
   * Called when event receiver contact changes
   */
  onEventContactChange(): void {
    // Auto-remove non-numeric characters
    this.eventReceiverContact = this.eventReceiverContact?.replace(/[^0-9]/g, '');
    
    if (!this.eventReceiverContact) {
      this.eventContactError = '';
      return;
    }
    
    if (this.eventReceiverContact.length > 11) {
      this.eventReceiverContact = this.eventReceiverContact.substring(0, 11);
    }
    
    if (this.eventReceiverContact.length === 11) {
      if (!this.validateContact(this.eventReceiverContact)) {
        this.eventContactError = 'Must start with 017, 016, 019, 018, 013, 014, or 015';
      } else {
        this.eventContactError = '';
      }
    } else if (this.eventReceiverContact.length > 0 && this.eventReceiverContact.length < 11) {
      this.eventContactError = 'Contact must be exactly 11 digits';
    } else {
      this.eventContactError = '';
    }
  }

  // ==================== EVENT SEARCH ====================
  filterEvents(): void {
    const search = this.eventSearchText?.toLowerCase() || '';
    this.filteredEvents = (this.data.events || []).filter((e: any) => 
      e.eventName.toLowerCase().includes(search)
    );
  }

  onEventSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = this.data.events.find((e: any) => e.eventName === event.option.value);
    if (selected) {
      this.selectedEventId = selected.id;
      this.eventSearchText = selected.eventName;
    }
  }

  // ==================== DEPARTMENT SEARCH ====================
  filterDepartments(): void {
    const search = this.deptSearchText?.toLowerCase() || '';
    this.filteredDepartments = (this.data.departments || []).filter((d: any) => 
      d.departmentName.toLowerCase().includes(search)
    );
  }

  onDepartmentSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = this.data.departments.find((d: any) => d.departmentName === event.option.value);
    if (selected) {
      this.selectedDepartmentId = selected.id;
      this.deptSearchText = selected.departmentName;
    }
  }

  // ==================== GOODS SEARCH ====================
  filterGoods(): void {
    const search = this.goodsSearchText?.toLowerCase() || '';
    this.filteredGoods = (this.data.goods || []).filter((g: any) => 
      g.name.toLowerCase().includes(search)
    );
  }

  onGoodsSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = this.data.goods.find((g: any) => g.name === event.option.value);
    if (selected) {
      this.selectedGoodsId = selected.id;
      this.goodsSearchText = selected.name;
      
      const nonReturnableCategories = ['Oil', 'Fuel', 'Detergent', 'Cleaning'];
      if (nonReturnableCategories.includes(selected.categoryName)) {
        this.selectedReturnableType = 'NON_RETURNABLE';
      } else {
        this.selectedReturnableType = 'RETURNABLE';
      }
    }
  }

  // ==================== ADD / REMOVE ITEMS ====================
  addItem(): void {
    if (!this.selectedGoodsId || !this.selectedQuantity || this.selectedQuantity < 1) {
      this.toastr.warning('Please select goods and quantity');
      return;
    }

    const goods = this.data.goods.find((g: any) => g.id === this.selectedGoodsId);
    if (!goods) return;

    const alreadyAdded = this.items
      .filter(i => i.goodsId === this.selectedGoodsId)
      .reduce((sum, i) => sum + i.quantity, 0);

    if (alreadyAdded + this.selectedQuantity > goods.quantity) {
      this.toastr.error(`Only ${goods.quantity} available. Already in cart: ${alreadyAdded}`);
      return;
    }

    const existing = this.items.find(i => i.goodsId === this.selectedGoodsId);
    if (existing) {
      existing.quantity += this.selectedQuantity;
    } else {
      this.items.push({
        goodsId: this.selectedGoodsId,
        quantity: this.selectedQuantity,
        returnableType: this.selectedReturnableType,
        goodsName: goods.name,
        unit: goods.categoryUnit
      });
    }
    
    this.selectedGoodsId = null;
    this.goodsSearchText = '';
    this.selectedQuantity = 1;
    this.selectedReturnableType = 'RETURNABLE';
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  getTotalItems(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  // ==================== SUBMIT ====================
  onSubmit(): void {
    if (this.items.length === 0) {
      this.toastr.error('Please add at least one item');
      return;
    }

    const request: any = {
      transactionCategory: this.transactionType,
      approvedBy: this.approvedBy,
      items: this.items.map(i => ({
        goodsId: i.goodsId,
        quantity: i.quantity,
        returnableType: i.returnableType
      }))
    };

    if (this.transactionType === 'NORMAL') {
      if (!this.receiverName || !this.receiverContact || !this.receiverDutyPlace) {
        this.toastr.error('Please fill all receiver details');
        return;
      }
      if (!this.validateContact(this.receiverContact)) {
        this.toastr.error('Invalid contact number. Must be 11 digits starting with 017, 016, 019, 018, 013, 014, 015');
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
      if (!this.validateContact(this.eventReceiverContact)) {
        this.toastr.error('Invalid contact number. Must be 11 digits starting with 017, 016, 019, 018, 013, 014, 015');
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