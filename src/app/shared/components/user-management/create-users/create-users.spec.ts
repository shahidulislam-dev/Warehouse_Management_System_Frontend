import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUsers } from './create-users';

describe('CreateUsers', () => {
  let component: CreateUsers;
  let fixture: ComponentFixture<CreateUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
