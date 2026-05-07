import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnTransactionDialog } from './return-transaction-dialog';

describe('ReturnTransactionDialog', () => {
  let component: ReturnTransactionDialog;
  let fixture: ComponentFixture<ReturnTransactionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnTransactionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnTransactionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
