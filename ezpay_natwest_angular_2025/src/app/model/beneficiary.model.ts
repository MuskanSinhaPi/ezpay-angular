export interface Beneficiary {
  id: number;
  name: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  email?: string;
  phone?: string;
  createdAt: Date;
}
