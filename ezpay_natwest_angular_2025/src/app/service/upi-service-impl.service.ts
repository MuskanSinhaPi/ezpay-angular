import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UpiTransaction } from '../model/upi-transaction.model';
import { UpiServiceDAO } from './upi-service-dao';

@Injectable({
    providedIn: 'root'
})

export class UpiServiceImpl implements UpiServiceDAO {
    private apiUrl = `${environment.apiUrl}/upi/transactions`;

    constructor(private http: HttpClient) { }

    // Create a new UPI transaction
    createTransaction(transaction: Partial<UpiTransaction>): Observable<UpiTransaction> {
        return this.http.post<UpiTransaction>(`${this.apiUrl}/create`, transaction);
    }

    // Get all transactions
    getAllTransactions(): Observable<UpiTransaction[]> {
        return this.http.get<UpiTransaction[]>(`${this.apiUrl}/all`);
    }


    // Get transaction by ID
    getTransactionById(id: string): Observable<UpiTransaction> {
        return this.http.get<UpiTransaction>(`${this.apiUrl}/${id}`);
    }

    // Get transactions by status
    getTransactionsByStatus(status: 'SUCCESS' | 'FAILED' | 'PENDING'): Observable<UpiTransaction[]> {
        return this.http.get<UpiTransaction[]>(`${this.apiUrl}/status/${status}`);
    }

    // Verify transaction (additional method)
    verifyTransaction(id: number, pin: string): Observable<UpiTransaction> {
        return this.http.post<UpiTransaction>(`${this.apiUrl}/${id}/verify`, null, {
            params: { pin }
        });
    }
    // Delete transaction (for testing purposes)
    deleteTransaction(id: string): Observable<String> {
        return this.http.delete<String>(`${this.apiUrl}/${id}`);
    }

    //Get transactions by UPI ID
    getTransactionsByUpiId(upiId: string): Observable<UpiTransaction[]> {
        return this.http.get<UpiTransaction[]>(`${this.apiUrl}/upiId/${upiId}`);
    }

}