import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionStatusSuccessComponent } from './transaction-status-success.component';

describe('TransactionStatusSuccessComponent', () => {
  let component: TransactionStatusSuccessComponent;
  let fixture: ComponentFixture<TransactionStatusSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionStatusSuccessComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionStatusSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display success title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Transaction Successful!');
  });

  it('should display success message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.message')?.textContent).toContain('Your payment has been processed successfully');
  });

  it('should display done button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-primary')?.textContent?.trim()).toBe('DONE');
  });

  it('should call onDone when done button is clicked', () => {
    spyOn(component, 'onDone');
    const button = fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement;
    button.click();
    expect(component.onDone).toHaveBeenCalled();
  });

  it('should log message when onDone is called', () => {
    spyOn(console, 'log');
    component.onDone();
    expect(console.log).toHaveBeenCalledWith('Done clicked');
  });
});