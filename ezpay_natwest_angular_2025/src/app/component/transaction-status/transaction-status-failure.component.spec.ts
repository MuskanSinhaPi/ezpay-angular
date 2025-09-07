import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionStatusFailureComponent } from './transaction-status-failure.component';

describe('TransactionStatusFailureComponent', () => {
  let component: TransactionStatusFailureComponent;
  let fixture: ComponentFixture<TransactionStatusFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionStatusFailureComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionStatusFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display failure title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Transaction Failed');
  });

  it('should display failure message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.message')?.textContent).toContain('Your transaction could not be completed');
  });

  it('should display transaction details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const details = compiled.querySelector('.transaction-details');
    expect(details).toBeTruthy();
    expect(details?.textContent).toContain('John Doe');
    expect(details?.textContent).toContain('£500.00');
    expect(details?.textContent).toContain('Insufficient funds');
  });

  it('should display back button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.back-btn')?.textContent?.trim()).toBe('Back');
  });

  it('should display try again button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-primary')?.textContent?.trim()).toBe('TRY AGAIN');
  });

  it('should display go home button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-secondary')?.textContent?.trim()).toBe('GO TO HOME');
  });

  it('should call onBack when back button is clicked', () => {
    spyOn(component, 'onBack');
    const button = fixture.nativeElement.querySelector('.back-btn') as HTMLButtonElement;
    button.click();
    expect(component.onBack).toHaveBeenCalled();
  });

  it('should call onTryAgain when try again button is clicked', () => {
    spyOn(component, 'onTryAgain');
    const button = fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement;
    button.click();
    expect(component.onTryAgain).toHaveBeenCalled();
  });

  it('should call onGoHome when go home button is clicked', () => {
    spyOn(component, 'onGoHome');
    const button = fixture.nativeElement.querySelector('.btn-secondary') as HTMLButtonElement;
    button.click();
    expect(component.onGoHome).toHaveBeenCalled();
  });

  it('should log messages when methods are called', () => {
    spyOn(console, 'log');
    
    component.onBack();
    expect(console.log).toHaveBeenCalledWith('Back clicked');
    
    component.onTryAgain();
    expect(console.log).toHaveBeenCalledWith('Try again clicked');
    
    component.onGoHome();
    expect(console.log).toHaveBeenCalledWith('Go to home clicked');
  });
});