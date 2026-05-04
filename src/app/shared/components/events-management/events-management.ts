import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EventsService, EventsResponse } from '../../../services/events-service';
import { AuthService } from '../../../auth/services/auth-service';
import { GlobalToastrService } from '../../../services/global-toastr-service';
import { CreateEvents } from './create-events/create-events';

@Component({
  selector: 'app-events-management',
  standalone: false,
  templateUrl: './events-management.html',
  styleUrl: './events-management.css'
})
export class EventsManagement implements OnInit {
  displayedColumns: string[] = ['id', 'eventName', 'eventDate', 'active', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<EventsResponse>();
  loading = false;

  constructor(
    private dialog: MatDialog,
    private eventsService: EventsService,
    public authService: AuthService,
    private toastr: GlobalToastrService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }
  today: Date = new Date();

  loadEvents(): void {
    this.loading = true;
    this.eventsService.getAllEvents().subscribe({
      next: (events) => {
        this.dataSource.data = events;
        this.today = new Date();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.toastr.error('Failed to load events');
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateEvents, {
      width: '90vw',
      maxWidth: '600px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEvents();
      }
    });
  }

  editEvent(event: EventsResponse): void {
    const dialogRef = this.dialog.open(CreateEvents, {
      width: '90vw',
      maxWidth: '600px',
      disableClose: true,
      data: { event: event }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEvents();
      }
    });
  }

  deleteEvent(event: EventsResponse): void {
    if (confirm(`Are you sure you want to delete "${event.eventName}"?`)) {
      this.eventsService.deleteEvent(event.id).subscribe({
        next: () => {
          this.toastr.success('Event deleted successfully!');
          this.loadEvents();
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.toastr.error('Failed to delete event');
        }
      });
    }
  }
}