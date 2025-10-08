import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserRole } from './update-user-role';

describe('UpdateUserRole', () => {
  let component: UpdateUserRole;
  let fixture: ComponentFixture<UpdateUserRole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateUserRole]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUserRole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
