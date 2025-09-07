import { Observable } from 'rxjs';
import { BankTransaction } from '../model/bank-transaction.model';

export interface BankServiceDAO {

  createTransaction(transaction: Omit<BankTransaction, 'id' | 'status' | 'transactionDate'>): Observable<BankTransaction>;

  getAllTransactions(): Observable<BankTransaction[]>;

  getTransactionById(id: number): Observable<BankTransaction | undefined>;

  getTransactionsByAccount(accountNumber: string): Observable<BankTransaction[]>;

  getTransactionsByRecipient(searchTerm: string): Observable<BankTransaction[]>;

  getTransactionsByStatus(status: 'SUCCESS' | 'FAILED' | 'PENDING'): Observable<BankTransaction[]>;

  updateTransactionStatus(id: number, status: 'SUCCESS' | 'FAILED' | 'PENDING'): Observable<BankTransaction>;

  deleteTransaction(id: number): Observable<boolean>;

  getTransactionsByDateRange(startDate: Date, endDate: Date): Observable<BankTransaction[]>;

  getRecentTransactions(limit?: number): Observable<BankTransaction[]>;

  getTotalTransactionAmount(): Observable<number>;

  processTransaction(id: number): Observable<BankTransaction>;
}
