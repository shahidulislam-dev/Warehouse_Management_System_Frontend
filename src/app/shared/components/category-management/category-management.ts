import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryService, GoodsCategoryWrapper } from '../../../services/category-service';
import { GlobalToastrService } from '../../../services/global-toastr-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../../auth/services/auth-service';
import { CreateCategory } from './create-category/create-category';
import { GoodsCategory } from '../../../services/goods-service';

@Component({
  selector: 'app-category-management',
  standalone: false,
  templateUrl: './category-management.html',
  styleUrl: './category-management.css'
})
export class CategoryManagement implements OnInit {
 displayedColumns: string[] = ['id', 'name', 'unit', 'actions'];
  dataSource = new MatTableDataSource<GoodsCategory>();
  loading = false;
  today: Date = new Date();

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    public authService: AuthService,
    private toastr: GlobalToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.dataSource.data = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
        this.toastr.error('Failed to load categories');
      }
    });
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(CreateCategory, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Category created successfully!');
        this.loadCategories();
      }
    });
  }

  editCategory(category: GoodsCategory): void {
    const dialogRef = this.dialog.open(CreateCategory, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      disableClose: true,
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Category updated successfully!');
        this.loadCategories();
      }
    });
  }

  deleteCategory(category: GoodsCategory): void {
    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response: string) => {
          this.toastr.success('Category deleted successfully!');
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          let errorMessage = 'Error deleting category';
          
          if (typeof error.error === 'string') {
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