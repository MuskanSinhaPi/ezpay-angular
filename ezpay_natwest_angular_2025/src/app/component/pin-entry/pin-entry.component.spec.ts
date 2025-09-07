/**
 * PinEntryComponent Unit Tests
 * ----------------------------
 * This test suite verifies the functionality of the PinEntryComponent:
 * - Ensures the component initializes correctly.
 * - Validates PIN entry logic for both valid and invalid inputs.
 * - Checks proper error message handling and clearing.
 *
 * Author: Aziz Mehevi
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PinEntryComponent } from './pin-entry.component';

describe('PinEntryComponent', () => {
  let component: PinEntryComponent;  // Component instance for testing
  let fixture: ComponentFixture<PinEntryComponent>;  // Fixture to create the component and access DOM

  beforeEach(async () => {
    // Configure the testing module with component declaration and FormsModule for ngModel binding
    await TestBed.configureTestingModule({
      declarations: [ PinEntryComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents(); // Compile template and CSS
  });

  beforeEach(() => {
    // Create the component and initialize
    fixture = TestBed.createComponent(PinEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  /**
   * Test Case 1:
   * Should create the PinEntryComponent successfully
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test Case 2:
   * Should display an error message when an invalid PIN (less than 4 digits) is entered
   */
  it('should show error message for invalid PIN', () => {
    component.pin = '12';       // Invalid PIN (only 2 digits)
    component.verifyPin();      // Call the verify method
    expect(component.errorMessage).toBe('Please enter a valid 4-digit PIN.');
  });

  /**
   * Test Case 3:
   * Should clear the error message when a valid 4-digit PIN is entered
   */
  it('should clear error message for valid PIN', () => {
    component.pin = '1234';     // Valid PIN
    component.verifyPin();      // Call the verify method
    expect(component.errorMessage).toBe(''); // No error message expected
  });
});
