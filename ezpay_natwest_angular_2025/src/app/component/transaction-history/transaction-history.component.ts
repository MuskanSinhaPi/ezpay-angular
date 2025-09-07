import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpiServiceImpl } from '../../service/upi-service-impl.service';
import { UpiTransaction } from '../../model/upi-transaction.model';

/**
 * Transaction History Component
 *
 * This component provides a comprehensive view of all UPI transactions.
 * Features include:
 * - Complete transaction history display in tabular format
 * - Filtering by transaction status (Success/Failed/Pending)
 * - Search functionality by UPI ID
 * - Transaction statistics display
 * 
 *
 * author Simran
 * version 1.0.0
 *
 */
@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  standalone: false,
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  /**
   * Complete list of all transactions from the database
   */
  transactionHistory: UpiTransaction[] = [];
  
  /**
   * Filtered list of transactions based on current filter/search criteria
   * This is what gets displayed in the UI
   */
  filteredTransactions: UpiTransaction[] = [];
  
  /**
   * Loading state indicator for async operations
   */
  isLoading: boolean = false;
  
  /**
   * Currently selected filter option
   * Values: 'all' | 'SUCCESS' | 'FAILED' | 'PENDING'
   */
  selectedFilter: string = 'all';
  
  /**
   * Current search term for UPI ID search
   */
  searchTerm: string = '';

  constructor(
    private upiService: UpiServiceImpl,
    private router: Router
  ) {}

  /**
   * Component initialization lifecycle hook
   * Loads all transactions when component is initialized
   */
  ngOnInit(): void {
    this.loadTransactionHistory();
  }

  /**
   * Loads complete transaction history from the backend service
   * Sets both transactionHistory and filteredTransactions arrays
   * Handles loading state and error scenarios
   */
  loadTransactionHistory(): void {
    this.isLoading = true;
    this.upiService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactionHistory = transactions;
        this.filteredTransactions = transactions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Filters transactions based on their status
   * Updates the filteredTransactions array to show only matching transactions
   *
   *param-status: The status to filter by ('all' | 'SUCCESS' | 'FAILED' | 'PENDING')
   */
  filterTransactions(status: string): void {
    this.selectedFilter = status;
    this.isLoading = true;
    
    if (status === 'all') {
      this.loadTransactionHistory();
    } else {
      this.upiService.getTransactionsByStatus(status as 'SUCCESS' | 'FAILED' | 'PENDING').subscribe({
        next: (transactions) => {
          this.filteredTransactions = transactions;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error filtering transactions:', error);
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * Searches transactions by UPI ID
   * Performs a case-insensitive search on the UPI ID field
   *
   * @param searchUpiId The UPI ID to search for
   */
  searchByUpiId(searchUpiId: string): void {
    this.searchTerm = searchUpiId;
    if (searchUpiId) {
      this.isLoading = true;
      this.upiService.getTransactionsByUpiId(searchUpiId).subscribe({
        next: (transactions) => {
          this.filteredTransactions = transactions;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching transactions:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.loadTransactionHistory();
    }
  }

  /**
   * Clears all active filters and search terms
   * Resets the view to show all transactions
   */
  clearFilters(): void {
    this.selectedFilter = 'all';
    this.searchTerm = '';
    this.loadTransactionHistory();
  }

  /**
   * Navigates back to the UPI transfer page
   * @deprecated Removed from UI - users now use navbar for navigation
   */
  goBack(): void {
    this.router.navigate(['/upi']);
  }

  /**
   * Returns the appropriate CSS class for status badge styling
   *
   * param status: Transaction status
   * returns CSS :class name for the status badge
   *
 
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'SUCCESS':
        return 'badge-success';
      case 'FAILED':
        return 'badge-danger';
      case 'PENDING':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  /**
   * Formats date for display in Indian locale
   *
   * param date- Date object to format
   * returns Formatted date- string in format: DD/MM/YY, HH:MM AM/PM
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  }

  /**
   * Calculates the count of transactions for a specific status
   * Used in statistics cards display
   *
   * param status- Transaction status to count
   * returns Number- of transactions with the specified status
   */
  getStatusCount(status: string): number {
    return this.filteredTransactions.filter(t => t.status === status).length;
  }

}