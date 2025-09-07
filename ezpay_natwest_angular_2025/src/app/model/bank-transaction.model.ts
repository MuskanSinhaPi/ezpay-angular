export interface BankTransaction {
  id: number;                         // Unique transaction ID
  senderAccountNumber: string;         // Sender's bank account number
  recipientAccountNumber: string;      // Recipient's bank account number
  ifscCode: string;                    // Recipient bank IFSC code
  recipientName: string;               // Recipient's name
  amount: number;                      // Amount in INR
  remarks?: string;                    // Optional remarks
  transactionType: 'CREDIT' | 'DEBIT'; // Transaction type
  status: 'SUCCESS' | 'FAILED' | 'PENDING'; // Transaction status
  transactionDate: Date;               // Date & time of transaction
}
