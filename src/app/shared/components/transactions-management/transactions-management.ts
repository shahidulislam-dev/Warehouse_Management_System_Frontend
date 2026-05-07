// shared/components/transactions-management/transactions-management.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionsService, TransactionResponse } from '../../../services/transactions-service';
import { EventsService, EventsResponse } from '../../../services/events-service';
import { DepartmentsService, DepartmentsResponse } from '../../../services/departments-service';
import { GoodsService, GoodsWrapper } from '../../../services/goods-service';
import { AuthService } from '../../../auth/services/auth-service';
import { GlobalToastrService } from '../../../services/global-toastr-service';
import { CreateTransactions } from './create-transactions/create-transactions';
import { ReturnTransactionDialog } from './return-transaction-dialog/return-transaction-dialog';
import { TransactionItemsDialog } from './transaction-items-dialog/transaction-items-dialog';

@Component({
  selector: 'app-transactions-management',
  standalone: false,
  templateUrl: './transactions-management.html',
  styleUrl: './transactions-management.css'
})
export class TransactionsManagement implements OnInit {

  allColumns: string[] = [
    'id', 'transactionCategory', 'itemsCount', 'issueDate', 'returnDate',
    'receiverName', 'receiverContact', 'receiverDutyPlace',
    'eventName', 'departmentName', 'eventReceiverName', 'eventReceiverContact',
    'issuedByName', 'status', 'actions'
  ];

  normalColumns: string[] = [
    'id', 'transactionCategory', 'itemsCount', 
    'receiverName', 'receiverContact', 'receiverDutyPlace',
    'issuedByName', 'issueDate', 'returnDate', 'status', 'actions'
  ];

  eventColumns: string[] = [
    'id', 'transactionCategory', 'itemsCount',
    'eventName', 'departmentName', 'eventReceiverName', 'eventReceiverContact',
    'issuedByName', 'issueDate', 'returnDate', 'status', 'actions'
  ];

  displayedColumns: string[] = this.allColumns;
  dataSource = new MatTableDataSource<TransactionResponse>();
  loading = false;

  events: EventsResponse[] = [];
  departments: DepartmentsResponse[] = [];
  goods: GoodsWrapper[] = [];

  // Filter state
  selectedTransactionType: any = null;
  selectedEventId: string = '';
  selectedDepartmentId: string = '';
  searchReceiverName: string = '';
  searchContact: string = '';
  searchApprovedBy: string = '';
  searchDutyPlace: string = '';
  searchEventReceiverName: string = '';
  searchEventReceiverContact: string = '';

  today: Date = new Date();

  constructor(
    private dialog: MatDialog,
    private transactionsService: TransactionsService,
    private eventsService: EventsService,
    private departmentsService: DepartmentsService,
    private goodsService: GoodsService,
    public authService: AuthService,
    private toastr: GlobalToastrService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadEvents();
    this.loadDepartments();
    this.loadGoods();
  }

  loadTransactions(): void {
    this.loading = true;
    this.transactionsService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.dataSource.data = transactions;
        this.loading = false;
        this.today = new Date();
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.toastr.error('Failed to load transactions');
        this.loading = false;
      }
    });
  }

  loadEvents(): void {
    this.eventsService.getAllEvents().subscribe({
      next: (events) => this.events = events,
      error: (error) => console.error('Error loading events:', error)
    });
  }

  loadDepartments(): void {
    this.departmentsService.getAllDepartments().subscribe({
      next: (departments) => this.departments = departments,
      error: (error) => console.error('Error loading departments:', error)
    });
  }

  loadGoods(): void {
    this.goodsService.getAllGoods().subscribe({
      next: (goods) => this.goods = goods,
      error: (error) => console.error('Error loading goods:', error)
    });
  }

  getEventName(eventId: string): string {
    const id = Number(eventId);
    const event = this.events.find(e => e.id === id);
    return event ? event.eventName : `Event ${id}`;
  }

  getDepartmentName(deptId: string): string {
    const id = Number(deptId);
    const dept = this.departments.find(d => d.id === id);
    return dept ? dept.departmentName : `Dept ${id}`;
  }

  showAllTransactions(): void {
    this.selectedTransactionType = null;
    this.selectedEventId = '';
    this.selectedDepartmentId = '';
    this.clearAllSearchFields();
    this.displayedColumns = this.allColumns;
    this.loadTransactions();
  }

  showByTransactionType(type: string): void {
    this.selectedTransactionType = type;
    this.selectedEventId = '';
    this.selectedDepartmentId = '';
    this.clearAllSearchFields();
    
    if (type === 'NORMAL') {
      this.displayedColumns = this.normalColumns;
    } else if (type === 'EVENT') {
      this.displayedColumns = this.eventColumns;
    }
    
    this.loading = true;
    this.transactionsService.getByCategory(type).subscribe({
      next: (transactions) => {
        this.dataSource.data = transactions;
        this.loading = false;
        this.today = new Date();
      },
      error: () => {
        this.toastr.error('Failed to filter');
        this.loading = false;
      }
    });
  }

  onSearchReceiverChange(): void {
    if (!this.searchReceiverName && !this.searchContact && !this.searchApprovedBy) {
      this.loadTransactions();
    } else {
      this.applySearchAll();
    }
  }

  onSearchContactChange(): void {
    if (!this.searchReceiverName && !this.searchContact && !this.searchApprovedBy) {
      this.loadTransactions();
    } else {
      this.applySearchAll();
    }
  }

  onSearchApprovedByChange(): void {
    if (!this.searchReceiverName && !this.searchContact && !this.searchApprovedBy) {
      this.loadTransactions();
    } else {
      this.applySearchAll();
    }
  }

  onSearchNormalChange(): void {
    if (!this.searchReceiverName && !this.searchContact && !this.searchDutyPlace) {
      this.showByTransactionType('NORMAL');
    } else {
      this.applySearchNormal();
    }
  }

  onSearchEventChange(): void {
    if (!this.selectedEventId && !this.selectedDepartmentId && 
        !this.searchEventReceiverName && !this.searchEventReceiverContact) {
      this.showByTransactionType('EVENT');
    } else {
      this.applySearchEvent();
    }
  }

  applySearchAll(): void {
    this.loading = true;
    if (this.searchReceiverName) {
      this.transactionsService.getByReceiverName(this.searchReceiverName).subscribe({
        next: (transactions) => {
          this.dataSource.data = transactions;
          this.loading = false;
          this.today = new Date();
        },
        error: () => {
          this.transactionsService.getByEventReceiverName(this.searchReceiverName).subscribe({
            next: (transactions) => {
              this.dataSource.data = transactions;
              this.loading = false;
            },
            error: () => {
              if (this.searchContact) this.searchByContactAll();
              else if (this.searchApprovedBy) this.searchByApprovedAll();
              else { this.toastr.warning('No results'); this.loading = false; }
            }
          });
        }
      });
    } else if (this.searchContact) {
      this.searchByContactAll();
    } else if (this.searchApprovedBy) {
      this.searchByApprovedAll();
    } else {
      this.loadTransactions();
    }
  }

  private searchByContactAll(): void {
    this.transactionsService.getByReceiverContact(this.searchContact).subscribe({
      next: (transactions) => {
        this.dataSource.data = transactions;
        this.loading = false;
        this.today = new Date();
      },
      error: () => {
        this.transactionsService.getByEventReceiverContact(this.searchContact).subscribe({
          next: (transactions) => {
            this.dataSource.data = transactions;
            this.loading = false;
          },
          error: () => { this.toastr.warning('No results'); this.loading = false; }
        });
      }
    });
  }

  private searchByApprovedAll(): void {
    this.transactionsService.getByApprovedBy(this.searchApprovedBy).subscribe({
      next: (transactions) => {
        this.dataSource.data = transactions;
        this.loading = false;
        this.today = new Date();
      },
      error: () => { this.toastr.warning('No results'); this.loading = false; }
    });
  }

  applySearchNormal(): void {
    this.loading = true;
    this.transactionsService.getByCategory('NORMAL').subscribe({
      next: (transactions) => {
        let filtered = transactions;
        if (this.searchReceiverName) {
          filtered = filtered.filter(t => (t.receiverName || '').toLowerCase().includes(this.searchReceiverName.toLowerCase()));
        }
        if (this.searchContact) {
          filtered = filtered.filter(t => (t.receiverContact || '').toLowerCase().includes(this.searchContact.toLowerCase()));
        }
        if (this.searchDutyPlace) {
          filtered = filtered.filter(t => (t.receiverDutyPlace || '').toLowerCase().includes(this.searchDutyPlace.toLowerCase()));
        }
        this.dataSource.data = filtered;
        this.loading = false;
        this.today = new Date();
      },
      error: () => { this.toastr.error('Failed to filter'); this.loading = false; }
    });
  }

  applySearchEvent(): void {
    this.loading = true;
    if (this.selectedEventId) {
      this.transactionsService.getByEventId(Number(this.selectedEventId)).subscribe({
        next: (transactions) => this.applyEventFilters(transactions),
        error: () => { this.toastr.error('Failed'); this.loading = false; }
      });
    } else if (this.selectedDepartmentId) {
      this.transactionsService.getByDepartmentId(Number(this.selectedDepartmentId)).subscribe({
        next: (transactions) => this.applyEventFilters(transactions),
        error: () => { this.toastr.error('Failed'); this.loading = false; }
      });
    } else {
      this.transactionsService.getByCategory('EVENT').subscribe({
        next: (transactions) => this.applyEventFilters(transactions),
        error: () => { this.toastr.error('Failed'); this.loading = false; }
      });
    }
  }

  private applyEventFilters(transactions: TransactionResponse[]): void {
    let filtered = transactions;
    if (this.selectedEventId && this.selectedDepartmentId) {
      filtered = filtered.filter(t => t.departmentId === Number(this.selectedDepartmentId));
    }
    if (this.searchEventReceiverName) {
      filtered = filtered.filter(t => (t.eventReceiverName || '').toLowerCase().includes(this.searchEventReceiverName.toLowerCase()));
    }
    if (this.searchEventReceiverContact) {
      filtered = filtered.filter(t => (t.eventReceiverContact || '').toLowerCase().includes(this.searchEventReceiverContact.toLowerCase()));
    }
    this.dataSource.data = filtered;
    this.loading = false;
    this.today = new Date();
  }

  clearFilters(): void {
    this.selectedTransactionType = null;
    this.selectedEventId = '';
    this.selectedDepartmentId = '';
    this.clearAllSearchFields();
    this.displayedColumns = this.allColumns;
    this.loadTransactions();
  }

  private clearAllSearchFields(): void {
    this.searchReceiverName = '';
    this.searchContact = '';
    this.searchApprovedBy = '';
    this.searchDutyPlace = '';
    this.searchEventReceiverName = '';
    this.searchEventReceiverContact = '';
  }

  private reloadAfterAction(): void {
    if (this.selectedTransactionType === 'NORMAL') {
      this.applySearchNormal();
    } else if (this.selectedTransactionType === 'EVENT') {
      this.applySearchEvent();
    } else if (this.searchReceiverName || this.searchContact || this.searchApprovedBy) {
      this.applySearchAll();
    } else {
      this.loadTransactions();
    }
  }

  // View transaction items
  viewItems(transaction: TransactionResponse): void {
    this.dialog.open(TransactionItemsDialog, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '80vh',
      disableClose: false,
      data: { transaction: transaction }
    });
  }

  // CREATE
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateTransactions, {
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '90vh',
      disableClose: true,
      data: { events: this.events, departments: this.departments, goods: this.goods }
    });
    dialogRef.afterClosed().subscribe(result => { if (result) this.reloadAfterAction(); });
  }

  // EDIT
  editTransaction(transaction: TransactionResponse): void {
    this.transactionsService.getTransactionById(transaction.id).subscribe({
      next: (tx) => {
        const dialogRef = this.dialog.open(CreateTransactions, {
          width: '90vw', maxWidth: '800px', maxHeight: '90vh', disableClose: true,
          data: { events: this.events, departments: this.departments, goods: this.goods, transaction: tx, isEdit: true }
        });
        dialogRef.afterClosed().subscribe(result => { if (result) this.reloadAfterAction(); });
      }
    });
  }

  // RETURN
  openReturnDialog(transaction: TransactionResponse): void {
    const dialogRef = this.dialog.open(ReturnTransactionDialog, {
      width: '90vw', maxWidth: '600px', disableClose: true,
      data: { transaction: transaction }
    });
    dialogRef.afterClosed().subscribe(result => { if (result) this.reloadAfterAction(); });
  }

  // DELETE
  deleteTransaction(transaction: TransactionResponse): void {
    if (confirm(`Delete transaction #${transaction.id}?`)) {
      this.transactionsService.deleteTransaction(transaction.id).subscribe({
        next: () => { this.toastr.success('Deleted!'); this.reloadAfterAction(); },
        error: () => this.toastr.error('Failed to delete')
      });
    }
  }
}