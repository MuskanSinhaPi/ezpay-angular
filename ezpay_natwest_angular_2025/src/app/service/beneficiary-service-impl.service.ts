import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Beneficiary } from '../model/beneficiary.model';

import { BeneficiaryServiceDAO, BeneficiaryCreate, BeneficiaryUpdate } from './beneficiary-service-dao';

@Injectable({ providedIn: 'root' })
export class BeneficiaryServiceImpl implements BeneficiaryServiceDAO {
  /** simple in-memory store (replace with HTTP later) */
  private beneficiaries: Beneficiary[] = [
    {
      id: 1,
      name: 'John Doe',
      accountNumber: '1234567890',
      bankName: 'HDFC Bank',
      ifsc: 'HDFC0001234',
      email: 'john@example.com',
      phone: '9876543210',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    },
    {
      id: 2,
      name: 'Priya Sharma',
      accountNumber: '9988776655',
      bankName: 'ICICI Bank',
      ifsc: 'ICIC0000123',
      email: 'priya@example.com',
      phone: '9123456789',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: 3,
      name: 'Simran Choudhary',
      accountNumber: '9123456789',
      bankName: 'HDFC Bank',
      ifsc: 'HDFC0000321',
      email: 'simran@example.com',
      phone: '5738290183',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: 4,
      name: 'Jay Patel',
      accountNumber: '5678901234',
      bankName: 'SBI Bank',
      ifsc: 'SBIN0000123',
      email: 'jay@example.com',
      phone: '9876543210',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: 5,
      name: 'Shizuka Tanaka',
      accountNumber: '9926351534',
      bankName: 'HDFC Bank',
      ifsc: 'HDFC0000123',
      email: 'shizuka@example.com',
      phone: '9123456789',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
  ];
  private nextId = 6;

  // ---- Create ----
  addBeneficiary(payload: BeneficiaryCreate): Observable<Beneficiary> {
    // basic duplicate check (same account + IFSC)
    const dup = this.beneficiaries.find(
      b => b.accountNumber === payload.accountNumber && b.ifsc.toUpperCase() === payload.ifsc.toUpperCase()
    );
    if (dup) {
      return throwError(() => new Error('Beneficiary already exists for this account & IFSC.'));
    }

    const beneficiary: Beneficiary = {
      id: this.nextId++,
      createdAt: new Date(),
      ...payload,
      ifsc: payload.ifsc.toUpperCase(),
    };
    this.beneficiaries = [beneficiary, ...this.beneficiaries];
    return of(beneficiary).pipe(delay(400));
  }

  // ---- Read ----
  getAllBeneficiaries(): Observable<Beneficiary[]> {
    // return a copy
    return of([...this.beneficiaries]).pipe(delay(250));
  }

  getBeneficiaryById(id: number): Observable<Beneficiary | undefined> {
    const b = this.beneficiaries.find(x => x.id === id);
    return of(b).pipe(delay(150));
  }

  // ---- Search / filters ----
  getBeneficiariesByAccountNumber(accountNumber: string): Observable<Beneficiary[]> {
    const out = this.beneficiaries.filter(b => b.accountNumber === accountNumber);
    return of(out).pipe(delay(150));
  }

  getBeneficiariesByNameOrAccount(searchTerm: string): Observable<Beneficiary[]> {
    const term = (searchTerm || '').toLowerCase();
    const out = this.beneficiaries.filter(
      b =>
        (b.name && b.name.toLowerCase().includes(term)) ||
        (b.accountNumber && b.accountNumber.toLowerCase().includes(term))
    );
    return of(out).pipe(delay(150));
  }

  getBeneficiariesByBankOrIfsc(searchTerm: string): Observable<Beneficiary[]> {
    const term = (searchTerm || '').toLowerCase();
    const out = this.beneficiaries.filter(
      b =>
        (b.bankName && b.bankName.toLowerCase().includes(term)) ||
        (b.ifsc && b.ifsc.toLowerCase().includes(term))
    );
    return of(out).pipe(delay(150));
  }

  getRecentBeneficiaries(limit = 5): Observable<Beneficiary[]> {
    const out = [...this.beneficiaries]
      .sort((a, b) => +b.createdAt - +a.createdAt)
      .slice(0, Math.max(0, limit));
    return of(out).pipe(delay(150));
  }

  // ---- Update ----
  updateBeneficiary(id: number, changes: BeneficiaryUpdate): Observable<Beneficiary> {
    const idx = this.beneficiaries.findIndex(b => b.id === id);
    if (idx === -1) return throwError(() => new Error('Beneficiary not found'));

    const updated: Beneficiary = {
      ...this.beneficiaries[idx],
      ...changes,
      ifsc: changes.ifsc ? String(changes.ifsc).toUpperCase() : this.beneficiaries[idx].ifsc,
    };
    this.beneficiaries[idx] = updated;
    return of(updated).pipe(delay(250));
  }

  // ---- Delete ----
  deleteBeneficiary(id: number): Observable<boolean> {
    const initial = this.beneficiaries.length;
    this.beneficiaries = this.beneficiaries.filter(b => b.id !== id);
    return of(this.beneficiaries.length < initial).pipe(delay(150));
  }
}
