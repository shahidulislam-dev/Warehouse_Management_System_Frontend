import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryService, GoodsCategoryWrapper } from '../../../services/category-service';
import { GlobalToastrService } from '../../../services/global-toastr-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../../auth/services/auth-service';
import { CreateCategory } from './create-category/create-category';

@Component({
  selector: 'app-category-management',
  standalone: false,
  templateUrl: './category-management.html',
  styleUrl: './category-management.css'
})
export class CategoryManagement implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<GoodsCategoryWrapper>();
  loading = false;
  isAdmin = false;
  today: Date = new Date();
  totalCategories = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private authService: AuthService,
    private toastr: GlobalToastrService
  ) {}

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  checkAdminRole(): void {
    this.isAdmin = this.authService.isAdmin() || this.authService.isSuperAdmin();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.dataSource.data = categories;
        this.totalCategories = categories.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
        this.toastr.error('Failed to load categories');
        this.dataSource.data = [];
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(CreateCategory, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.toastr.success('Category created successfully!');
        this.loadCategories();
      }
    });
  }

  editCategory(category: GoodsCategoryWrapper): void {
    const dialogRef = this.dialog.open(CreateCategory, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true,
      data: { category: category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.toastr.success('Category updated successfully!');
        this.loadCategories();
      }
    });
  }

  deleteCategory(category: GoodsCategoryWrapper): void {
    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      this.loading = true;
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response: any) => {
          this.toastr.success('Category deleted successfully!');
          this.loading = false;
          
          const currentData = this.dataSource.data;
          const updatedData = currentData.filter(item => item.id !== category.id);
          this.dataSource.data = updatedData;
          this.totalCategories = updatedData.length;
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.loading = false;
          
          let errorMessage = 'Error deleting category';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.toastr.error(errorMessage);
        }
      });
    }
  }
}