import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionHistoryComponent } from './transaction-history.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { UpiServiceImpl } from '../../services/upi-service-impl.service';
import { of } from 'rxjs';

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;
  let mockUpiService: jasmine.SpyObj<UpiServiceImpl>;

  beforeEach(async () => {
    mockUpiService = jasmine.createSpyObj('UpiServiceImpl', [
      'getAllTransactions',
      'getTransactionsByStatus',
      'getTransactionsByUpiId'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ TransactionHistoryComponent ],
      imports: [ RouterTestingModule, FormsModule ],
      providers: [
        { provide: UpiServiceImpl, useValue: mockUpiService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    
    // Setup default mock return values
    mockUpiService.getAllTransactions.and.returnValue(of([]));
    mockUpiService.getTransactionsByStatus.and.returnValue(of([]));
    mockUpiService.getTransactionsByUpiId.and.returnValue(of([]));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions on init', () => {
    expect(mockUpiService.getAllTransactions).toHaveBeenCalled();
  });

  it('should filter transactions by status', () => {
    component.filterTransactions('SUCCESS');
    expect(mockUpiService.getTransactionsByStatus).toHaveBeenCalledWith('SUCCESS');
    expect(component.selectedFilter).toBe('SUCCESS');
  });

  it('should search transactions by UPI ID', () => {
    const testUpiId = 'test@bank';
    component.searchByUpiId(testUpiId);
    expect(mockUpiService.getTransactionsByUpiId).toHaveBeenCalledWith(testUpiId);
    expect(component.searchTerm).toBe(testUpiId);
  });

  it('should clear filters and reload all transactions', () => {
    component.selectedFilter = 'SUCCESS';
    component.searchTerm = 'test';
    component.clearFilters();
    expect(component.selectedFilter).toBe('all');
    expect(component.searchTerm).toBe('');
    expect(mockUpiService.getAllTransactions).toHaveBeenCalled();
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('SUCCESS')).toBe('badge-success');
    expect(component.getStatusClass('FAILED')).toBe('badge-danger');
    expect(component.getStatusClass('PENDING')).toBe('badge-warning');
    expect(component.getStatusClass('OTHER')).toBe('badge-secondary');
  });
});