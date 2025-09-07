import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BankServiceImpl } from '../../service/bank-service-imp.service';
import { BankTransaction } from '../../model/bank-transaction.model';

/**
 * BankTransferComponent
 * ---------------------
 * Handles bank transfer operations including:
 * - Input validation via reactive forms
 * - Initiating bank transfers
 * - Displaying recent and full transaction history
 * - Navigation to PIN entry for authentication
 * 
 * Author: Aditi Roy
 */

@Component({
  selector: 'app-bank-transfer',
  templateUrl: './bank-transfer.component.html',
  styleUrls: ['./bank-transfer.component.css'],
  standalone: false
})
export class BankTransferComponent implements OnInit {

  /** Reactive form for bank transfer */
  bankTransferForm!: FormGroup;

  /** Loader state for initiating transactions */
  isLoading = false;

  /** Recently fetched bank transactions (last 5) */
  recentTransactions: BankTransaction[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly bankService: BankServiceImpl,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  /**
   * Lifecycle hook: initializes the form,
   * sets up validators, subscriptions, prefill logic,
   * and loads recent transactions.
   */
  ngOnInit(): void {
    this.bankTransferForm = this.fb.group(
      {
        recipientAccount: ['', [Validators.required, Validators.pattern(/^\d{10,18}$/)]],
        confirmAccount: ['', [Validators.required]],
        ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
        recipientName: ['', Validators.required],
        amount: ['', [Validators.required, Validators.min(1)]],
        remarks: ['']
      },
      { validators: this.accountMatchValidator }
    );

    // Ensure confirmAccount stays in sync with recipientAccount
    this.f.recipientAccount.valueChanges.subscribe(() => {
      this.f.confirmAccount.updateValueAndValidity({ onlySelf: true });
    });

    // Always uppercase IFSC code
    this.f.ifscCode.valueChanges.subscribe(val => {
      const up = (val ?? '').toString().toUpperCase();
      if (up !== val) this.f.ifscCode.setValue(up, { emitEvent: false });
    });

    // Prefill form fields if query params are provided
    this.prefillFromQueryParams();

    // Load last 5 transactions
    this.loadRecentTransactions();
  }

  /**
   * Custom cross-field validator to ensure that
   * `recipientAccount` and `confirmAccount` values match.
   *
   * @param group The parent form group
   * @returns null if valid, error object if invalid
   */
  private accountMatchValidator(group: AbstractControl) {
    const acc = group.get('recipientAccount')?.value;
    const confirmAcc = group.get('confirmAccount')?.value;
    if (!acc || !confirmAcc) return null;
    return acc === confirmAcc ? null : { accountsMismatch: true };
  }

  /**
   * Prefills the bank transfer form using query parameters
   * passed from the beneficiary list (acc, name, ifsc).
   */
  private prefillFromQueryParams() {
    const qp = this.route.snapshot.queryParamMap;
    const acc = qp.get('acc');
    const name = qp.get('name');
    const ifsc = qp.get('ifsc');

    if (acc) {
      this.f.recipientAccount.setValue(acc);
      this.f.confirmAccount.setValue(acc);
    }
    if (name) this.f.recipientName.setValue(name);
    if (ifsc) this.f.ifscCode.setValue(ifsc.toUpperCase());
  }

  /**
   * Initiates a new bank transaction if the form is valid.
   * On success: navigates to the PIN entry page.
   * On failure: shows an error message.
   */
  initiateTransaction(): void {
    if (this.bankTransferForm.invalid) {
      this.bankTransferForm.markAllAsTouched();
      return;
    }

    const transaction: Omit<BankTransaction, 'id' | 'status' | 'transactionDate'> = {
      senderAccountNumber: '1234567890', // TODO: replace with logged-in user's account
      recipientAccountNumber: this.f.recipientAccount.value,
      ifscCode: this.f.ifscCode.value,
      recipientName: this.f.recipientName.value,
      amount: this.f.amount.value,
      remarks: this.f.remarks.value,
      transactionType: 'DEBIT'
    };

    this.isLoading = true;

    this.bankService.createTransaction(transaction).subscribe({
      next: (tx: BankTransaction) => {
        this.isLoading = false;
        this.router.navigate(['/enter-pin'], {
          queryParams: { transactionId: tx.id, type: 'bank' }
        });
      },
      error: (err: unknown) => {
        this.isLoading = false;
        console.error('Error creating transaction:', err);
        alert('Failed to initiate transaction. Please try again.');
      }
    });
  }

  /**
   * Loads the most recent 5 transactions from the service.
   */
  loadRecentTransactions(): void {
    this.bankService.getRecentTransactions(5).subscribe({
      next: (txs: BankTransaction[]) => (this.recentTransactions = txs),
      error: (err: unknown) => console.error('Error loading recent transactions:', err)
    });
  }

  /**
   * Navigates user to the full bank transaction history page.
   */
  toggleHistory(): void {
    this.router.navigate(['/bank-transaction-history']);
  }

  /**
   * Shortcut accessor for form controls.
   */
  get f() {
    return this.bankTransferForm.controls as {
      recipientAccount: AbstractControl;
      confirmAccount: AbstractControl;
      ifscCode: AbstractControl;
      recipientName: AbstractControl;
      amount: AbstractControl;
      remarks: AbstractControl;
    };
  }

  /**
   * Formats a date object for display in UI.
   * @param date The date to format
   * @returns Formatted date string
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
  }

  /**
   * Maps transaction status to a CSS badge class.
   *
   * @param status SUCCESS | FAILED | PENDING
   * @returns corresponding CSS class name
   */
  getStatusClass(status: 'SUCCESS' | 'FAILED' | 'PENDING'): string {
    switch (status) {
      case 'SUCCESS': return 'badge-success';
      case 'FAILED': return 'badge-danger';
      case 'PENDING': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

  /**
   * Navigates to the Add Beneficiary form page.
   */
  goToAddBeneficiary() { this.router.navigate(['/beneficiaries/add']); }

  /**
   * Navigates to the Beneficiary list page.
   */
  goToShowBeneficiaries() { this.router.navigate(['/beneficiaries']); }
}
