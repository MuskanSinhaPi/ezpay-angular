import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TransactionStatusPendingComponent } from './transaction-status-pending.component';

describe('TransactionStatusPendingComponent', () => {
  let component: TransactionStatusPendingComponent;
  let fixture: ComponentFixture<TransactionStatusPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionStatusPendingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionStatusPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display pending title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Payment Processing');
  });

  it('should display important notice', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.notice-title')?.textContent).toContain('IMPORTANT');
    expect(compiled.querySelector('.notice-text')?.textContent).toContain('We are continuously checking');
  });

  it('should display transaction details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const details = compiled.querySelector('.transaction-details');
    expect(details).toBeTruthy();
    expect(details?.textContent).toContain('John Doe');
    expect(details?.textContent).toContain('£500.00');
    expect(details?.textContent).toContain('Processing');
  });

  it('should display timer with initial value', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.timer-text')?.textContent).toBe('1:00');
  });

  it('should countdown timer', fakeAsync(() => {
    expect(component.timeRemaining).toBe(60);
    tick(1000);
    expect(component.timeRemaining).toBe(59);
    tick(1000);
    expect(component.timeRemaining).toBe(58);
  }));

  it('should format time correctly', () => {
    expect(component.formatTime(60)).toBe('1:00');
    expect(component.formatTime(59)).toBe('0:59');
    expect(component.formatTime(0)).toBe('0:00');
  });

  it('should display info message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const infoMessage = compiled.querySelector('.info-message');
    expect(infoMessage?.textContent).toContain('Don\'t worry, your money is safe');
    expect(infoMessage?.textContent).toContain('3-5 working days');
  });

  it('should display back button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.back-btn')?.textContent?.trim()).toBe('Back');
  });

  it('should display check status button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-primary')?.textContent?.trim()).toBe('CHECK STATUS');
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

  it('should call onCheckStatus when check status button is clicked', () => {
    spyOn(component, 'onCheckStatus');
    const button = fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement;
    button.click();
    expect(component.onCheckStatus).toHaveBeenCalled();
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
    
    component.onCheckStatus();
    expect(console.log).toHaveBeenCalledWith('Check status clicked');
    
    component.onGoHome();
    expect(console.log).toHaveBeenCalledWith('Go to home clicked');
  });

  it('should stop timer when component is destroyed', fakeAsync(() => {
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(clearInterval).toHaveBeenCalled();
  }));
});