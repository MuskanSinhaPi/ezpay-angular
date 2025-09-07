import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-status-pending',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-status-pending.component.html',
  styleUrls: ['./transaction-status-pending.component.css']
})
export class TransactionStatusPendingComponent implements OnInit, OnDestroy {
  timeRemaining = 60; // 1 minute
  private timerInterval: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        clearInterval(this.timerInterval);
        this.router.navigate(['/']); // auto-redirect to homepage
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  onBack() {
    console.log('Back clicked');
  }

  onCheckStatus() {
    console.log('Check status clicked');
  }

  onGoHome() {
    this.router.navigate(['/']); // manual redirect via button
  }
}
