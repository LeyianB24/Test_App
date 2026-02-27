import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface MpesaTransaction {
  receiptNo: string;
  completionTime: string;
  details: string;
  amount: number;
  type: 'Buy Goods' | 'Pay Bill' | 'Sent' | 'Received';
  category?: 'Business' | 'Personal' | 'Tax' | 'Utility';
  taxable?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MpesaParserService {
  transactions = signal<MpesaTransaction[]>([]);

  parseStatement(file: File): Observable<MpesaTransaction[]> {
    // Simulated parsing logic
    return of(this.getMockTransactions()).pipe(
      delay(1500),
      map(txs => {
        this.transactions.set(txs);
        return txs;
      })
    );
  }

  getMockTransactions(): MpesaTransaction[] {
    return [
      { receiptNo: 'SDG12345H', completionTime: '2026-02-10 14:30', details: 'Safaricom Online Store', amount: -4500, type: 'Buy Goods', category: 'Business', taxable: true },
      { receiptNo: 'TFK98765G', completionTime: '2026-02-12 09:15', details: 'John Kamau (A001...Z)', amount: 150000, type: 'Received', category: 'Business', taxable: true },
      { receiptNo: 'QWE55443X', completionTime: '2026-02-15 18:45', details: 'KPLC PREPAID', amount: -3000, type: 'Pay Bill', category: 'Utility', taxable: false },
      { receiptNo: 'ZXC11223M', completionTime: '2026-02-18 11:20', details: 'Mama Mboga Market', amount: -1200, type: 'Buy Goods', category: 'Personal', taxable: false },
      { receiptNo: 'VBN44556K', completionTime: '2026-02-20 15:40', details: 'Rent Received - Feb 2026', amount: 85000, type: 'Received', category: 'Business', taxable: true }
    ];
  }

  getInsights() {
    const txs = this.transactions();
    return {
      totalIncome: txs.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0),
      businessExpenses: txs.filter(t => t.amount < 0 && t.category === 'Business').reduce((acc, t) => acc + Math.abs(t.amount), 0),
      detectedTax: txs.filter(t => t.category === 'Tax').reduce((acc, t) => acc + Math.abs(t.amount), 0)
    };
  }
}
