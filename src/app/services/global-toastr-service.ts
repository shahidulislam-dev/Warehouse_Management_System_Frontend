import { Injectable } from '@angular/core';
import { ToastrService, ProgressAnimationType } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GlobalToastrService {
  private defaultConfig = {
    timeOut: 3000,
    progressBar: true,
    progressAnimation: 'decreasing' as ProgressAnimationType,
    positionClass: 'toast-top-center', 
    closeButton: true,
    tapToDismiss: true,
    easeTime: 400, 
    enableHtml: false,
    toastClass: 'ngx-toastr'
  };

  constructor(private toastr: ToastrService) {}

  success(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title, this.defaultConfig);
  }

  error(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title, {
      ...this.defaultConfig,
      timeOut: 5000 
    });
  }

  warning(message: string, title: string = 'Warning'): void {
    this.toastr.warning(message, title, this.defaultConfig);
  }

  clear(): void {
    this.toastr.clear();
  }
}