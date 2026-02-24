import { Injectable } from '@angular/core';

export interface MpesaTransaction {
  receiptNo: string;
  completionDate: string;
  details: string;
  transactionStatus: string;
  paidIn: number;
  withdrawn: number;
  balance: number;
  category: string;
}

export interface MpesaSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  categories: { name: string; amount: number; count: number; type: 'income' | 'expense' }[];
  monthlyBreakdown: { month: string; income: number; expenses: number }[];
  topRecipients: { name: string; amount: number; count: number }[];
  topSenders: { name: string; amount: number; count: number }[];
}

const CATEGORY_RULES: { pattern: RegExp; category: string; }[] = [
  { pattern: /paybill|business|pay bill/i, category: 'Business Payment' },
  { pattern: /buy goods|till|merchant/i, category: 'Buy Goods' },
  { pattern: /salary|wages|payroll/i, category: 'Salary/Wages' },
  { pattern: /rent|landlord|housing/i, category: 'Rent' },
  { pattern: /safaricom|airtime|bundle|data/i, category: 'Airtime & Data' },
  { pattern: /kplc|kenya power|electricity|water|nairobi.*water/i, category: 'Utilities' },
  { pattern: /loan|fuliza|kcb.*mpesa|mshwari/i, category: 'Loans & Credit' },
  { pattern: /bank|equity|cooperative|ncba|absa|stanbic/i, category: 'Bank Transfer' },
  { pattern: /customer.*transfer|send.*money|give/i, category: 'Personal Transfer' },
  { pattern: /withdraw|agent|atm/i, category: 'Withdrawal' },
  { pattern: /deposit|cash.*in/i, category: 'Deposit' },
  { pattern: /reversal|reverse/i, category: 'Reversal' },
];

@Injectable({ providedIn: 'root' })
export class MpesaParserService {

  /**
   * Parse M-PESA CSV statement text into structured transactions
   */
  parseCSV(csvText: string): MpesaTransaction[] {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    const transactions: MpesaTransaction[] = [];

    // Find the header row - M-PESA statements usually start with "Receipt No"
    let headerIndex = lines.findIndex(l => /receipt\s*no/i.test(l));
    if (headerIndex === -1) headerIndex = 0; // fallback

    const headers = this.splitCSVLine(lines[headerIndex]).map(h => h.trim().toLowerCase());

    // Map column indices
    const colMap = {
      receipt:    headers.findIndex(h => /receipt/i.test(h)),
      date:       headers.findIndex(h => /completion.*time|date/i.test(h)),
      details:    headers.findIndex(h => /detail/i.test(h)),
      status:     headers.findIndex(h => /status/i.test(h)),
      paidIn:     headers.findIndex(h => /paid\s*in/i.test(h)),
      withdrawn:  headers.findIndex(h => /withdraw/i.test(h)),
      balance:    headers.findIndex(h => /balance/i.test(h)),
    };

    for (let i = headerIndex + 1; i < lines.length; i++) {
      const cols = this.splitCSVLine(lines[i]);
      if (cols.length < 4) continue;

      const paidIn    = this.parseAmount(cols[colMap.paidIn] ?? '0');
      const withdrawn = this.parseAmount(cols[colMap.withdrawn] ?? '0');

      const tx: MpesaTransaction = {
        receiptNo:         cols[colMap.receipt] ?? '',
        completionDate:    cols[colMap.date] ?? '',
        details:           cols[colMap.details] ?? '',
        transactionStatus: cols[colMap.status] ?? 'Completed',
        paidIn,
        withdrawn,
        balance:           this.parseAmount(cols[colMap.balance] ?? '0'),
        category:          this.categorize(cols[colMap.details] ?? '', paidIn, withdrawn),
      };

      if (tx.receiptNo.trim()) {
        transactions.push(tx);
      }
    }

    return transactions;
  }

  /**
   * Generate a tax-oriented summary from parsed transactions
   */
  summarize(transactions: MpesaTransaction[]): MpesaSummary {
    const totalIncome   = transactions.reduce((s, t) => s + t.paidIn, 0);
    const totalExpenses = transactions.reduce((s, t) => s + t.withdrawn, 0);

    // Category aggregation
    const catMap = new Map<string, { amount: number; count: number; type: 'income' | 'expense' }>();
    for (const tx of transactions) {
      const key = tx.category;
      const existing = catMap.get(key) || { amount: 0, count: 0, type: tx.paidIn > 0 ? 'income' as const : 'expense' as const };
      existing.amount += tx.paidIn > 0 ? tx.paidIn : tx.withdrawn;
      existing.count++;
      catMap.set(key, existing);
    }
    const categories = Array.from(catMap.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.amount - a.amount);

    // Monthly breakdown
    const monthMap = new Map<string, { income: number; expenses: number }>();
    for (const tx of transactions) {
      const month = this.extractMonth(tx.completionDate);
      const existing = monthMap.get(month) || { income: 0, expenses: 0 };
      existing.income   += tx.paidIn;
      existing.expenses += tx.withdrawn;
      monthMap.set(month, existing);
    }
    const monthlyBreakdown = Array.from(monthMap.entries())
      .map(([month, v]) => ({ month, ...v }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Top recipients (by withdrawn amount)
    const recipientMap = new Map<string, { amount: number; count: number }>();
    for (const tx of transactions) {
      if (tx.withdrawn > 0) {
        const name = this.extractName(tx.details);
        const existing = recipientMap.get(name) || { amount: 0, count: 0 };
        existing.amount += tx.withdrawn;
        existing.count++;
        recipientMap.set(name, existing);
      }
    }
    const topRecipients = Array.from(recipientMap.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Top senders (by paidIn amount)
    const senderMap = new Map<string, { amount: number; count: number }>();
    for (const tx of transactions) {
      if (tx.paidIn > 0) {
        const name = this.extractName(tx.details);
        const existing = senderMap.get(name) || { amount: 0, count: 0 };
        existing.amount += tx.paidIn;
        existing.count++;
        senderMap.set(name, existing);
      }
    }
    const topSenders = Array.from(senderMap.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      transactionCount: transactions.length,
      categories,
      monthlyBreakdown,
      topRecipients,
      topSenders,
    };
  }

  // ---- Private helpers ----

  private splitCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  private parseAmount(val: string): number {
    const cleaned = val.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  }

  private categorize(details: string, paidIn: number, withdrawn: number): string {
    for (const rule of CATEGORY_RULES) {
      if (rule.pattern.test(details)) return rule.category;
    }
    return paidIn > 0 ? 'Other Income' : 'Other Expense';
  }

  private extractMonth(dateStr: string): string {
    // Handle formats like "15/1/2025 10:30:00 AM" or "2025-01-15"
    try {
      const parts = dateStr.split(/[/\-]/);
      if (parts.length >= 2) {
        // Assume DD/MM/YYYY or YYYY-MM-DD
        if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}`;
        return `${parts[2]?.substring(0, 4)}-${parts[1].padStart(2, '0')}`;
      }
    } catch { /* ignore */ }
    return 'Unknown';
  }

  private extractName(details: string): string {
    // Try to extract a name/entity from the transaction details
    const cleaned = details
      .replace(/\d{10,}/g, '') // Remove phone numbers
      .replace(/KES\s*[\d,.]+/gi, '') // Remove amounts
      .replace(/on\s+\d{1,2}\/\d{1,2}\/\d{2,4}/gi, '') // Remove dates
      .trim();
    // Take first meaningful segment
    const parts = cleaned.split(/[-–]/).map(p => p.trim()).filter(p => p.length > 2);
    return parts[0]?.substring(0, 40) || 'Unknown';
  }
}
