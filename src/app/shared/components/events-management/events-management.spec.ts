import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsManagement } from './events-management';

describe('EventsManagement', () => {
  let component: EventsManagement;
  let fixture: ComponentFixture<EventsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
