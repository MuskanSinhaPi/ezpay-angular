import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UpiServiceImpl } from '../../service/upi-service-impl.service';

@Component({
  selector: 'app-transaction-status-failure',
  standalone: false,
  templateUrl: './transaction-status-failure.component.html',
  styleUrls: ['./transaction-status-failure.component.css']
})
export class TransactionStatusFailureComponent implements OnInit {
  errorMessage: string = 'Transaction failed due to an unknown error. Please try again.';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private upiService: UpiServiceImpl
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['errorMessage']) {
        this.errorMessage = params['errorMessage'];
      }
    });
  }

  onBack() {
    console.log('Back clicked');
  }

  onTryAgain() {
    console.log('Try again clicked');
  }

  onGoHome() {
    console.log('Go to home clicked');
  }
}