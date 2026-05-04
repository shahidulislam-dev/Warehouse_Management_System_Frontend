import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsManagement } from './transactions-management';

describe('TransactionsManagement', () => {
  let component: TransactionsManagement;
  let fixture: ComponentFixture<TransactionsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
