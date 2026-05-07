import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionItemsDialog } from './transaction-items-dialog';

describe('TransactionItemsDialog', () => {
  let component: TransactionItemsDialog;
  let fixture: ComponentFixture<TransactionItemsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionItemsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionItemsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
