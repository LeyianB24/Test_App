import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
interface ReconciliationItem {
  id: string;
  source: 'eTIMS' | 'Payslip' | 'Bank' | 'Manual';
  date: string;
  description: string;
  amount: number;
  itaxPrepopulated: number;
  variance: number;
  status: 'Match' | 'Discrepancy' | 'Missing';
  category: string;
    { id: '4', source: 'eTIMS', date: '2025-02-05', description: 'Supply of Office Stationery', amount: 12400, itaxPrepopulated: 12400, variance: 0, status: 'Match', category: 'Expenses' },
    { id: '5', source: 'eTIMS', date: '2025-02-12', description: 'IT Support Services', amount: 95000, itaxPrepopulated: 95000, variance: 0, status: 'Match', category: 'Sales' },
  ]);

  filter = signal<'all' | 'match' | 'discrepancy'>('all');

  filteredItems = computed(() => {
    const currentFilter = this.filter();
    const currentItems = this.items();
    if (currentFilter === 'all') return currentItems;
    return currentItems.filter(i => i.status.toLowerCase() === currentFilter);
  });

  matchesCount = computed(() => this.items().filter(i => i.status === 'Match').length);
  discrepanciesCount = computed(() => this.items().filter(i => i.status === 'Discrepancy').length);

  matchesPercent = computed(() => (this.matchesCount() / this.items().length) * 100);
  discrepanciesPercent = computed(() => (this.discrepanciesCount() / this.items().length) * 100);

  totalVariance = computed(() => this.items().reduce((acc, i) => acc + i.variance, 0));
}
