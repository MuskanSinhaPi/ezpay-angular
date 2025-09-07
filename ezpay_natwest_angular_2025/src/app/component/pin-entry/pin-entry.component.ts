/**
 * PinEntryComponent
 * ----------------------------
 * This component handles user PIN entry for secure verification.
 * Features:
 * - Accepts a 4-digit numeric PIN.
 * - Displays error message for invalid PIN.
 * - Confirms PIN when valid and sets verification flag.
 *
 * Author: Aziz Mehevi
 */

import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { UpiServiceImpl } from '../../service/upi-service-impl.service';
import { UpiTransaction } from '../../model/upi-transaction.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pin-entry',
  templateUrl: './pin-entry.component.html',
  standalone: false,
  styleUrls: ['./pin-entry.component.css']
})

export class PinEntryComponent implements OnInit {

  transactionId: number = 0;
  pin: string = '';
  pinVerified: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private upiService: UpiServiceImpl
  ) {}

  ngOnInit() {
    // Get transaction ID from route parameters
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && !isNaN(+id)) {
        this.transactionId = +id;
      } else {
        this.router.navigate(['/']); // Redirect to home if ID is invalid
      }
    });
  }

  verifyPin(): void {
    if (this.pin.length !== 4 || !/^\d+$/.test(this.pin)) {
      this.errorMessage = 'Please enter a valid 4-digit PIN.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.upiService.verifyTransaction(this.transactionId, this.pin)
      .subscribe({
        next: (transaction: UpiTransaction) => {
          this.pinVerified = true;
          this.router.navigate(['/transaction-status/success']);
        },
        error: (error) => {
          console.error('PIN verification failed:', error);
          this.errorMessage = error.error || 'PIN verification failed. Please try again.';
          this.pinVerified = false;
          this.router.navigate(['/transaction-status/failure' , this.errorMessage]);
        },

        complete: () => {
          this.isLoading = false;
        }
      });
  }

  resetPin(): void {
    this.pin = '';
    this.errorMessage = '';
    this.pinVerified = false;
  }
}
