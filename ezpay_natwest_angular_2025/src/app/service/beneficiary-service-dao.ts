import { Observable } from 'rxjs';
import { Beneficiary } from '../model/beneficiary.model';

export type BeneficiaryCreate = Omit<Beneficiary, 'id' | 'createdAt'>;
export type BeneficiaryUpdate = Partial<Omit<Beneficiary, 'id' | 'createdAt'>>;

export interface BeneficiaryServiceDAO {
  /** Create */
  addBeneficiary(payload: BeneficiaryCreate): Observable<Beneficiary>;

  /** Read */
  getAllBeneficiaries(): Observable<Beneficiary[]>;
  getBeneficiaryById(id: number): Observable<Beneficiary | undefined>;

  /** Search / filters */
  getBeneficiariesByAccountNumber(accountNumber: string): Observable<Beneficiary[]>;
  getBeneficiariesByNameOrAccount(searchTerm: string): Observable<Beneficiary[]>;
  getBeneficiariesByBankOrIfsc(searchTerm: string): Observable<Beneficiary[]>;
  getRecentBeneficiaries(limit?: number): Observable<Beneficiary[]>;

  /** Update */
  updateBeneficiary(id: number, changes: BeneficiaryUpdate): Observable<Beneficiary>;

  /** Delete */
  deleteBeneficiary(id: number): Observable<boolean>;
}
