import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransactions } from './create-transactions';

describe('CreateTransactions', () => {
  let component: CreateTransactions;
  let fixture: ComponentFixture<CreateTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
