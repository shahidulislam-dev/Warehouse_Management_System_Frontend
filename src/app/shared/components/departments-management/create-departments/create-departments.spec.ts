import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDepartments } from './create-departments';

describe('CreateDepartments', () => {
  let component: CreateDepartments;
  let fixture: ComponentFixture<CreateDepartments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateDepartments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDepartments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
