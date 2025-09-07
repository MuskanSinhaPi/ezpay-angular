import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BankTransaction } from '../model/bank-transaction.model';
import { BankServiceDAO } from './bank-service-dao';

@Injectable({
  providedIn: 'root'
})
export class BankServiceImpl implements BankServiceDAO {

  private transactions: BankTransaction[] = [
    {
      id: 1,
      senderAccountNumber: '1234567890',
      recipientAccountNumber: '0987654321',
      ifscCode: 'ABCD0123456',
      recipientName: 'John Doe',
      amount: 1500,
      remarks: 'Grocery shopping',
      transactionType: 'DEBIT',
      status: 'SUCCESS',
      transactionDate: new Date('2024-01-15T10:30:00')
    },
    {
      id: 2,
      senderAccountNumber: '1234567890',
      recipientAccountNumber: '1122334455',
      ifscCode: 'WXYZ0987654',
      recipientName: 'Alice',
      amount: 2500,
      remarks: 'Rent payment',
      transactionType: 'DEBIT',
      status: 'SUCCESS',
      transactionDate: new Date('2024-01-14T14:20:00')
    }
  ];

  private nextId = this.transactions.length + 1;

  constructor() { }

  createTransaction(transaction: Omit<BankTransaction, 'id' | 'status' | 'transactionDate'>): Observable<BankTransaction> {
    const newTransaction: BankTransaction = {
      id: this.nextId++,
      transactionDate: new Date(),
      status: 'PENDING',
      ...transaction
    };
    this.transactions.unshift(newTransaction);
    return of(newTransaction).pipe(delay(1000));
  }

  getAllTransactions(): Observable<BankTransaction[]> {
    return of([...this.transactions]).pipe(delay(500));
  }

  getTransactionById(id: number): Observable<BankTransaction | undefined> {
    const tx = this.transactions.find(t => t.id === id);
    return of(tx).pipe(delay(300));
  }

  getTransactionsByAccount(accountNumber: string): Observable<BankTransaction[]> {
    const filtered = this.transactions.filter(
      t => t.senderAccountNumber === accountNumber || t.recipientAccountNumber === accountNumber
    );
    return of(filtered).pipe(delay(400));
  }

  // ✅ New method: Get transactions by recipient name or account number
  getTransactionsByRecipient(searchTerm: string): Observable<BankTransaction[]> {
    const filtered = this.transactions.filter(
      t =>
        t.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.recipientAccountNumber.includes(searchTerm)
    );
    return of(filtered).pipe(delay(400));
  }

  getTransactionsByStatus(status: 'SUCCESS' | 'FAILED' | 'PENDING'): Observable<BankTransaction[]> {
    const filtered = this.transactions.filter(t => t.status === status);
    return of(filtered).pipe(delay(400));
  }

  updateTransactionStatus(id: number, status: 'SUCCESS' | 'FAILED' | 'PENDING'): Observable<BankTransaction> {
    const txIndex = this.transactions.findIndex(t => t.id === id);
    if (txIndex === -1) return throwError(() => new Error('Transaction not found'));
    this.transactions[txIndex].status = status;
    return of(this.transactions[txIndex]).pipe(delay(500));
  }

  deleteTransaction(id: number): Observable<boolean> {
    const initialLength = this.transactions.length;
    this.transactions = this.transactions.filter(t => t.id !== id);
    return of(this.transactions.length < initialLength).pipe(delay(300));
  }

  getTransactionsByDateRange(startDate: Date, endDate: Date): Observable<BankTransaction[]> {
    const filtered = this.transactions.filter(t => {
      const date = new Date(t.transactionDate);
      return date >= startDate && date <= endDate;
    });
    return of(filtered).pipe(delay(400));
  }

  getRecentTransactions(limit: number = 5): Observable<BankTransaction[]> {
    return of(this.transactions.slice(0, limit)).pipe(delay(300));
  }

  getTotalTransactionAmount(): Observable<number> {
    const total = this.transactions
      .filter(t => t.status === 'SUCCESS')
      .reduce((sum, t) => t.transactionType === 'CREDIT' ? sum + t.amount : sum - t.amount, 0);
    return of(total).pipe(delay(200));
  }

  processTransaction(id: number): Observable<BankTransaction> {
    const txIndex = this.transactions.findIndex(t => t.id === id);
    if (txIndex === -1) return throwError(() => new Error('Transaction not found'));

    const isSuccess = Math.random() > 0.2;
    this.transactions[txIndex].status = isSuccess ? 'SUCCESS' : 'FAILED';
    return of(this.transactions[txIndex]).pipe(delay(2000));
  }
}
