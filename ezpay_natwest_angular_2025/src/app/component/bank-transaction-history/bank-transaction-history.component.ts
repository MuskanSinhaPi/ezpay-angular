import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { BankServiceImpl } from '../../service/bank-service-imp.service';
import { BankTransaction } from '../../model/bank-transaction.model';

/**
 * Bank Transaction History Component
 *
 * This component is responsible for displaying a user's bank transaction history
 * in a tabular format. It allows:
 *  - Viewing all transactions
 *  - Filtering transactions by status (SUCCESS, FAILED, PENDING)
 *  - Searching transactions by recipient name or account
 *  - Counting transactions by status
 *  - Navigation back to the bank transfer page
 *
 * Author: Aditi Roy
 */
@Component({
  selector: 'app-bank-transaction-history', // Selector used in HTML to render this component
  templateUrl: './bank-transaction-history.component.html', // Component template (HTML)
  styleUrls: ['./bank-transaction-history.component.css'], // Component styles (CSS)
  standalone: false // Indicates this is not a standalone Angular component
})
export class BankTransactionHistoryComponent implements OnInit {

  // All transactions fetched from the backend
  transactionHistory: BankTransaction[] = [];

  // Filtered transactions to be displayed based on search/filter
  filteredTransactions: BankTransaction[] = [];

  // Loading indicator for async operations
  isLoading: boolean = false;

  // Currently selected filter ('all', 'SUCCESS', 'FAILED', 'PENDING')
  selectedFilter: string = 'all';

  // Search term entered by the user
  searchTerm: string = '';

  /**
   * Constructor injects:
   * 1. BankServiceImpl - to interact with backend API for fetching transactions
   * 2. Router - to navigate programmatically to other routes
   */
  constructor(
    private bankService: BankServiceImpl,
    private router: Router
  ) {}

  /**
   * ngOnInit lifecycle hook
   * Called once after the component is initialized
   * We use it to load the transaction history from the backend
   */
  ngOnInit(): void {
    this.loadTransactionHistory();
  }

  /**
   * Load all bank transactions
   * Sets isLoading to true during async call
   * Updates transactionHistory and filteredTransactions when data arrives
   * Handles errors by logging to console
   */
  loadTransactionHistory(): void {
    this.isLoading = true;
    this.bankService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactionHistory = transactions;
        this.filteredTransactions = transactions; // Initially show all transactions
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bank transactions:', error);
        this.isLoading = false; // Stop loading spinner on error
      }
    });
  }

  /**
   * Filter transactions by status
   * @param status - 'all', 'SUCCESS', 'FAILED', or 'PENDING'
   */
  filterTransactions(status: string): void {
    this.selectedFilter = status;
    this.isLoading = true;

    if (status === 'all') {
      // Show all transactions
      this.filteredTransactions = [...this.transactionHistory];
      this.isLoading = false;
    } else {
      // Fetch transactions from backend filtered by status
      this.bankService.getTransactionsByStatus(status as 'SUCCESS'|'FAILED'|'PENDING')
        .subscribe({
          next: (transactions) => {
            this.filteredTransactions = transactions;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error filtering bank transactions:', err);
            this.isLoading = false;
          }
        });
    }
  }

  /**
   * Search transactions by recipient name or account
   * @param recipientName - Name or account to search
   */
  searchByRecipient(recipientName: string): void {
    this.searchTerm = recipientName;

    if (recipientName) {
      this.isLoading = true;
      this.bankService.getTransactionsByRecipient(recipientName).subscribe({
        next: (transactions) => {
          this.filteredTransactions = transactions; // Update filtered list
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching transactions:', error);
          this.isLoading = false;
        }
      });
    } else {
      // If search term is empty, reload all transactions
      this.loadTransactionHistory();
    }
  }

  /**
   * Alias method to fix HTML template binding errors
   * This ensures the function called in template matches a valid TypeScript method
   */
  searchByRecipientName(recipientName: string): void {
    this.searchByRecipient(recipientName);
  }

  /**
   * Clear all filters and search
   * Resets selectedFilter and searchTerm
   * Shows all transactions
   */
  clearFilters(): void {
    this.selectedFilter = 'all';
    this.searchTerm = '';
    this.filteredTransactions = [...this.transactionHistory];
  }

  /**
   * Get CSS class for transaction status
   * @param status - Transaction status
   * @returns CSS class for badge color
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'SUCCESS': return 'badge-success'; // Green badge
      case 'FAILED': return 'badge-danger';   // Red badge
      case 'PENDING': return 'badge-warning'; // Yellow badge
      default: return 'badge-secondary';      // Gray for unknown
    }
  }

  /**
   * Format date in human-readable format (India locale)
   * @param date - Input date
   * @returns formatted string
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  }

  /**
   * Count the number of transactions with a specific status
   * @param status - 'SUCCESS', 'FAILED', 'PENDING'
   * @returns number of transactions with given status
   */
  getStatusCount(status: string): number {
    return this.filteredTransactions.filter(t => t.status === status).length;
  }

  /**
   * Navigate back to the bank transfer page
   */
  goBack(): void {
    this.router.navigate(['/bank-transfer']);
  }

}
