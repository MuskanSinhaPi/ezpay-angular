import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpiTransferComponent } from './upi-transfer.component';

describe('UpiTransferComponent', () => {
  let component: UpiTransferComponent;
  let fixture: ComponentFixture<UpiTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpiTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpiTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
