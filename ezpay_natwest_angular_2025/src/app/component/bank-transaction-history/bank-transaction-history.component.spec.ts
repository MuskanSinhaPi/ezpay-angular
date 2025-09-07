import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTransactionHistoryComponent } from './bank-transaction-history.component';

describe('BankTransactionHistoryComponent', () => {
  let component: BankTransactionHistoryComponent;
  let fixture: ComponentFixture<BankTransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankTransactionHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
