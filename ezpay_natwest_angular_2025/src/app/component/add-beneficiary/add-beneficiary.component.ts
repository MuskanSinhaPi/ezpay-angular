/**
 * AddBeneficiaryComponent
 * -----------------------
 * UI + logic for creating a new bank transfer beneficiary.
 *
 * Responsibilities:
 *  - Build & validate the reactive form
 *  - Normalize/validate IFSC and phone inputs
 *  - Submit to BeneficiaryService and route back to list on success
 *  - Show server errors inline on failure
 *
 * author: Simran Choudhary
 * version: 1.0
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, Validators, ReactiveFormsModule,
  AbstractControl, ValidationErrors, FormGroup
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Beneficiary } from '../../model/beneficiary.model';
import { BeneficiaryServiceImpl } from '../../service/beneficiary-service-impl.service';

@Component({
  selector: 'app-add-beneficiary',
  standalone: true,
  // Standalone component needs its own module imports for template features
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-beneficiary.component.html',
  styleUrls: ['./add-beneficiary.component.css']
})
export class AddBeneficiaryComponent implements OnInit {

  /** Reactive form instance backing the Add Beneficiary UI. Initialized in {@link ngOnInit}. */
  form!: FormGroup;

  /** Submission loading flag to disable the submit button and show progress text. */
  isSaving = false;

  /** Server-side error message to display above the action buttons. */
  serverError = '';

  /** IFSC format: 4 letters, '0', then 6 digits (case-insensitive here, normalized to uppercase on save). */
  private static IFSC_PATTERN = /^[A-Z]{4}0[0-9]{6}$/i;

  /** 10-digit numeric phone format. */
  private static PHONE_PATTERN = /^[0-9]{10}$/;

  /**
   * DI: FormBuilder for reactive forms, Router for navigation,
   *     BeneficiaryServiceImpl for in-memory CRUD (or later HTTP).
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private beneficiaryService: BeneficiaryServiceImpl
  ) {}

  /**
   * Lifecycle hook: Create the form group, attach validators,
   * and enable cross-field "account numbers must match" validation.
   */
  ngOnInit(): void {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        bankName: ['', [Validators.required]],
        ifsc: ['', [Validators.required, Validators.pattern(AddBeneficiaryComponent.IFSC_PATTERN)]],
        accountNumber: ['', [Validators.required, Validators.minLength(6)]],
        confirmAccountNumber: ['', [Validators.required]],
        email: ['', [Validators.email]],
        phone: ['', [Validators.pattern(AddBeneficiaryComponent.PHONE_PATTERN)]],
      },
      { validators: [accountsMatchValidator('accountNumber', 'confirmAccountNumber')] }
    );
  }

  /**
   * Convenience accessor for template bindings.
   * @returns form controls dictionary (by control name)
   */
  get f() {
    return this.form.controls;
  }

  /**
   * Handles submit:
   *  - Validates the form and shows control errors if invalid
   *  - Normalizes IFSC to uppercase
   *  - Calls service to persist and navigates back to list on success
   *  - Captures and displays server error on failure
   */
  save() {
    this.serverError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Omit<Beneficiary, 'id' | 'createdAt'> = {
      name: this.f['name'].value!,
      bankName: this.f['bankName'].value!,
      ifsc: String(this.f['ifsc'].value!).toUpperCase(), // normalize to uppercase
      accountNumber: this.f['accountNumber'].value!,
      email: this.f['email'].value || undefined,
      phone: this.f['phone'].value || undefined,
    };

    this.isSaving = true;
    this.beneficiaryService.addBeneficiary(payload as any).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/beneficiaries']);
      },
      error: (err) => {
        this.isSaving = false;
        this.serverError = (err && err.message) || 'Something went wrong. Please try again.';
      },
    });
  }

  /**
   * Cancels the creation flow and returns to the beneficiaries list.
   * No data is persisted.
   */
  cancel() {
    this.router.navigate(['/beneficiaries']);
  }
}

/**
 * Cross-field validator factory ensuring two controls match (e.g., accountNumber vs confirmAccountNumber).
 *
 * @param aKey Name of the primary control (e.g., 'accountNumber')
 * @param bKey Name of the confirmation control (e.g., 'confirmAccountNumber')
 * @returns A validator fn that returns null when matching, or { accountsMismatch: true } when not.
 */
function accountsMatchValidator(aKey: string, bKey: string) {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(aKey)?.value;
    const b = group.get(bKey)?.value;
    if (!a || !b) return null;           // defer error until both have values
    return a === b ? null : { accountsMismatch: true };
  };
}
