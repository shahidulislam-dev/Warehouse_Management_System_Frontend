import { Component, Inject } from '@angular/core';
import { EventsResponse, EventsService } from '../../../../services/events-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalToastrService } from '../../../../services/global-toastr-service';

export interface CreateEventData {
  event?: EventsResponse;
}

@Component({
  selector: 'app-create-events',
  standalone: false,
  templateUrl: './create-events.html',
  styleUrl: './create-events.css'
})
export class CreateEvents {
  eventForm: FormGroup;
  isEdit = false;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CreateEvents>,
    @Inject(MAT_DIALOG_DATA) public data: CreateEventData,
    private fb: FormBuilder,
    private eventsService: EventsService,
    private toastr: GlobalToastrService
  ) {
    this.isEdit = !!data.event;
    
    this.eventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.minLength(2)]],
      eventDate: [null, [Validators.required]], 
      active: [true]
    });

    if (this.isEdit && data.event) {
      this.eventForm.patchValue({
        eventName: data.event.eventName,
        eventDate: data.event.eventDate ? new Date(data.event.eventDate) : null,
        active: data.event.active
      });
    }
  }

  /**
   * Format Date object to yyyy-MM-dd string for backend
   */
  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.loading = true;
      const formValue = this.eventForm.value;
      
      const request = {
        eventName: formValue.eventName.trim(),
        eventDate: this.formatDate(formValue.eventDate),  // ✅ Format Date to string
        active: formValue.active
      };

      const operation = this.isEdit && this.data.event
        ? this.eventsService.updateEvent(this.data.event.id, request)
        : this.eventsService.createEvent(request);

      operation.subscribe({
        next: () => {
          this.toastr.success(`Event ${this.isEdit ? 'updated' : 'created'} successfully!`);
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving event:', error);
          this.toastr.error(`Failed to ${this.isEdit ? 'update' : 'create'} event`);
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.eventForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }
}