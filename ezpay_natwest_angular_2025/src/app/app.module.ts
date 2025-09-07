import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UpiTransferComponent } from './component/upi-transfer/upi-transfer.component';
import { FormsModule } from '@angular/forms';
import { BankTransferComponent } from './component/bank-transfer/bank-transfer.component';
import { PinEntryComponent } from './component/pin-entry/pin-entry.component';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { TransactionStatusFailureComponent } from './component/transaction-status/transaction-status-failure.component';
import { TransactionStatusSuccessComponent } from './component/transaction-status/transaction-status-success.component';
import { TransactionHistoryComponent } from './component/transaction-history/transaction-history.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BankTransactionHistoryComponent } from './component/bank-transaction-history/bank-transaction-history.component';
import { BeneficiaryListComponent } from './component/beneficiary-list/beneficiary-list.component';
import { AddBeneficiaryComponent } from './component/add-beneficiary/add-beneficiary.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    WelcomeComponent,
    UpiTransferComponent,
    BankTransferComponent,
    PinEntryComponent,
    TransactionStatusFailureComponent,
    TransactionStatusSuccessComponent,
    TransactionHistoryComponent,
    NavbarComponent,
    AppComponent,
    BankTransactionHistoryComponent,
    
  ], 
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AddBeneficiaryComponent,
    BeneficiaryListComponent,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}



