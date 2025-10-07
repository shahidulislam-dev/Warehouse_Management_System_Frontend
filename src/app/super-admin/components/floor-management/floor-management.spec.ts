import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorManagement } from './floor-management';

describe('FloorManagement', () => {
  let component: FloorManagement;
  let fixture: ComponentFixture<FloorManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FloorManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloorManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
