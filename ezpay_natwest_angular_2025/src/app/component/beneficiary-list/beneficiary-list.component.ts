import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Beneficiary } from '../../model/beneficiary.model';
import { BeneficiaryServiceImpl } from '../../service/beneficiary-service-impl.service';

@Component({
  selector: 'app-beneficiary-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './beneficiary-list.component.html',
  styleUrls: ['./beneficiary-list.component.css']
})
export class BeneficiaryListComponent implements OnInit, OnDestroy {
  // --- original/state fields you already use ---
  beneficiaries: Beneficiary[] = [];
  filtered: Beneficiary[] = [];
  loading = false;
  q = '';

  private destroy$ = new Subject<void>();

  // --- inline-edit state (added) ---
  editingId: number | null = null;
  editEmail = '';
  editPhone = '';

  constructor(
    private beneficiaryService: BeneficiaryServiceImpl,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- existing behavior: load data and apply filter ---
  fetch() {
    this.loading = true;
    this.beneficiaryService.getAllBeneficiaries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => {
          this.beneficiaries = list;
          this.applyFilter();
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }

  applyFilter() {
    const term = (this.q || '').toLowerCase().trim();
    if (!term) {
      this.filtered = [...this.beneficiaries];
      return;
    }
    this.filtered = this.beneficiaries.filter(b => {
      return (
        (b.name && b.name.toLowerCase().includes(term)) ||
        (b.bankName && b.bankName.toLowerCase().includes(term)) ||
        (b.ifsc && b.ifsc.toLowerCase().includes(term)) ||
        (b.accountNumber && b.accountNumber.toLowerCase().includes(term))
      );
    });
  }

  addNew() {
    // keep your existing navigation or creation flow here if you already had it
    this.router.navigate(['/bank-transfer'], { queryParams: { add: true } });
  }

  select(b: Beneficiary) {
    this.router.navigate(
      ['/bank-transfer'],
      {
        queryParams: {
          acc: b.accountNumber,
          name: b.name,
          ifsc: b.ifsc,
          email: b.email ?? '',
          phone: b.phone ?? ''
        }
      }
    );
  }

  delete(b: Beneficiary) {
    if (!confirm(`Remove beneficiary "${b.name}"?`)) return;
    this.beneficiaryService.deleteBeneficiary(b.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch());
  }

  // ------------- edit feature (added) -------------
  startEdit(b: Beneficiary) {
    this.editingId = b.id;
    this.editEmail = b.email ?? '';
    this.editPhone = b.phone ?? '';
  }

  cancelEdit() {
    this.editingId = null;
    this.editEmail = '';
    this.editPhone = '';
  }

  get phoneInvalid(): boolean {
    if (this.editingId === null) return false;
    const digits = (this.editPhone || '').replace(/\D/g, '');
    return !(digits.length >= 7 && digits.length <= 10);
  }

  get emailInvalid(): boolean {
    if (this.editingId === null) return false;
    const email = this.editEmail || '';
    return !!email && !/^\S+@\S+\.\S+$/.test(email);
  }

  saveEdit() {
    if (this.editingId == null) return;
    if (this.phoneInvalid || this.emailInvalid) return;

    this.beneficiaryService.updateBeneficiary(this.editingId, {
      email: this.editEmail || undefined,
      phone: this.editPhone || undefined
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.cancelEdit();
        this.fetch();
      }
    });
  }
}
