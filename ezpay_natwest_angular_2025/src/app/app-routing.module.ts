import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { UpiTransferComponent } from './component/upi-transfer/upi-transfer.component';
import { BankTransferComponent } from './component/bank-transfer/bank-transfer.component';
import { PinEntryComponent } from './component/pin-entry/pin-entry.component';
import { TransactionStatusSuccessComponent } from './component/transaction-status/transaction-status-success.component';
import { TransactionStatusPendingComponent } from './component/transaction-status/transaction-status-pending.component';
import { TransactionStatusFailureComponent } from './component/transaction-status/transaction-status-failure.component';
import { TransactionHistoryComponent } from './component/transaction-history/transaction-history.component';
import { BankTransactionHistoryComponent } from './component/bank-transaction-history/bank-transaction-history.component';
import { BeneficiaryListComponent } from './component/beneficiary-list/beneficiary-list.component';
import { AddBeneficiaryComponent } from './component/add-beneficiary/add-beneficiary.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },

  // Transfer routes
  { path: 'upi', component: UpiTransferComponent },
  { path: 'bank-transfer', component: BankTransferComponent },

  // PIN entry route
  { path: 'pin-entry/:id', component: PinEntryComponent },

  // Transaction status routes
  { path: 'transaction-status/success', component: TransactionStatusSuccessComponent },
  { path: 'transaction-status/pending', component: TransactionStatusPendingComponent },
  { path: 'transaction-status/failure/:errorMessage', component: TransactionStatusFailureComponent },

  
  // History routes
  { path: 'transaction-history', component: TransactionHistoryComponent },
  { path: 'bank-transaction-history', component: BankTransactionHistoryComponent },

  { path: 'beneficiaries', component: BeneficiaryListComponent },
  { path: 'beneficiaries/add', component: AddBeneficiaryComponent },

  // Fallback
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
