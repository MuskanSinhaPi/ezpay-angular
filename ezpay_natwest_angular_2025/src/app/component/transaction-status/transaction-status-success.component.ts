import { Component } from '@angular/core';

@Component({
  selector: 'app-transaction-status-success',
  standalone: false,
  templateUrl: './transaction-status-success.component.html',
  styleUrls: ['./transaction-status-success.component.css']
})
export class TransactionStatusSuccessComponent {
  transactionId: string;

  constructor() {
    this.transactionId = this.generateTransactionId();
  }

  generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${timestamp}${random}`;
  }

  onDone() {
    console.log('Done clicked');
  }
}