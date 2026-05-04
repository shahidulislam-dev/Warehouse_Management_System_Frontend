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

@Component({
  selector: 'app-transactions-management',
  standalone: false,
  templateUrl: './transactions-management.html',
  styleUrl: './transactions-management.css'
})
export class TransactionsManagement implements OnInit {
  displayedColumns: string[] = [
    'id', 'transactionCategory', 'goodsName', 'quantityIssued', 'quantityReturned',
    'receiverName', 'eventName', 'departmentName', 'issueDate', 'returnDate', 'status', 'actions'
  ];
  dataSource = new MatTableDataSource<TransactionResponse>();
  loading = false;
  
  events: EventsResponse[] = [];
  departments: DepartmentsResponse[] = [];
  goods: GoodsWrapper[] = [];

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

  today: Date = new Date();
  loadTransactions(): void {
    this.loading = true;
    this.transactionsService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.dataSource.data = transactions;
        this.today = new Date();
        this.loading = false;
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

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateTransactions, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        events: this.events,
        departments: this.departments,
        goods: this.goods
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  filterByCategory(category: string): void {
    this.loading = true;
    this.transactionsService.getByCategory(category).subscribe({
      next: (transactions) => {
        this.dataSource.data = transactions;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to filter transactions');
        this.loading = false;
      }
    });
  }

  showAll(): void {
    this.loadTransactions();
  }

  deleteTransaction(transaction: TransactionResponse): void {
    if (confirm(`Are you sure you want to delete transaction #${transaction.id}?`)) {
      this.transactionsService.deleteTransaction(transaction.id).subscribe({
        next: () => {
          this.toastr.success('Transaction deleted successfully!');
          this.loadTransactions();
        },
        error: (error) => {
          this.toastr.error('Failed to delete transaction');
        }
      });
    }
  }
}