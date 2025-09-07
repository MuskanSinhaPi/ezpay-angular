export interface UpiTransaction {
    id?: number;
    senderUpiId: string;
    receiverUpiId: string;
    amount: number;
    remarks?: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    timestamp : Date;
}