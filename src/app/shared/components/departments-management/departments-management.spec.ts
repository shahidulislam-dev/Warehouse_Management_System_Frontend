import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsManagement } from './departments-management';

describe('DepartmentsManagement', () => {
  let component: DepartmentsManagement;
  let fixture: ComponentFixture<DepartmentsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
