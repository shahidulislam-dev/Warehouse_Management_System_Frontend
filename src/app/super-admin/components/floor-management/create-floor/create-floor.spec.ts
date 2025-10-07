import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFloor } from './create-floor';

describe('CreateFloor', () => {
  let component: CreateFloor;
  let fixture: ComponentFixture<CreateFloor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateFloor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFloor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
