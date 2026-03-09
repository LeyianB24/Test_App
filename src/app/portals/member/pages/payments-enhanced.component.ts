import { Component, inject, signal, computed, ViewChild, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { PaymentFormComponent } from '../../../components/payment-form/payment-form.component';
import { NotificationService } from '../../../core/services/notification.service';
import { SkeletonLoaderComponent } from '../../../components/skeleton-loader/skeleton-loader.component';
import { ToastContainerComponent } from '../../../components/toast-container/toast-container.component';

interface Payment {
  id: number;
  taxpayerId: string;
  taxpayerName: string;
  paymentDate: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  paymentMethod: string;
  referenceNumber?: string;
  prn?: string;
  transaction_id?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-payments-enhanced',
  imports: [CommonModule, FormsModule, PaymentFormComponent, SkeletonLoaderComponent, ToastContainerComponent],
  template: `
    <div class="animate-fade-in p-2 md:p-6 lg:p-8">
    
      <!-- HD Page Header -->
      <header class="mb-10 lg:mb-14">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                PAYMENTS MODULE
              </span>
            </div>
            <h1 class="premium-title">Wealth <span class="text-emerald-500">Transaction Terminal</span></h1>
            <p class="text-slate-400 text-lg md:text-xl font-medium mt-1">Digital Financial Telemetry & Secure Fiscal Processing</p>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <button class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors flex items-center gap-2 shadow-sm text-sm disabled:opacity-50" (click)="refreshPayments()" [disabled]="loading()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              {{ loading() ? 'SYNCHRONIZING...' : 'REFRESH INTEL' }}
            </button>
            <button class="btn-primary py-3 px-6 shadow-lg shadow-emerald-500/25 bg-emerald-600 hover:bg-emerald-500" (click)="togglePaymentForm()">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              {{ showPaymentForm() ? 'SHIELD PORTAL' : 'EXECUTE PAYMENT' }}
            </button>
          </div>
        </div>
      </header>

      <!-- HD Payment Form (Collapsible) -->
      @if (showPaymentForm()) {
        <div class="mb-10 lg:mb-14 animate-fade-in">
          <div class="glass-panel p-8 relative overflow-hidden ring-1 ring-emerald-500/30">
            <div class="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div class="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-white/10 relative z-10 gap-4">
              <h3 class="premium-subtitle m-0 uppercase flex items-center gap-3">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Execution Protocol
              </h3>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ENCRYPTION ACTIVE
              </div>
            </div>
            <div class="relative z-10">
              <app-payment-form #paymentForm></app-payment-form>
            </div>
          </div>
        </div>
      }

      <!-- HD Metrics Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-10 lg:mb-14">
        <div class="glass-panel p-6 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" (click)="filterByStatus('pending')">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 to-transparent"></div>
          <div class="flex justify-between items-start mb-6">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 bg-amber-500/10 text-amber-400">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 z-10 relative">Oustanding Liability</h3>
          <div class="text-2xl lg:text-3xl font-bold text-white tracking-tight z-10 relative mb-4">KES {{ totalPending() | number:'1.2-2' }}</div>
          <div class="pt-4 border-t border-white/10">
            <span class="text-[10px] font-bold uppercase text-slate-500 tracking-widest">{{ pendingCount() }} QUEUED TRANSACTIONS</span>
          </div>
        </div>

        <div class="glass-panel p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" (click)="filterByStatus('completed')">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 to-transparent"></div>
          <div class="flex justify-between items-start mb-6">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 bg-emerald-500/10 text-emerald-400">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 z-10 relative">Volume Processed</h3>
          <div class="text-2xl lg:text-3xl font-bold text-white tracking-tight z-10 relative mb-4">KES {{ totalCompleted() | number:'1.2-2' }}</div>
          <div class="pt-4 border-t border-white/10">
            <span class="text-[10px] font-bold uppercase text-emerald-500 tracking-widest">{{ completedCount() }} VERIFIED PAYMENTS</span>
          </div>
        </div>

        <div class="glass-panel p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 to-transparent"></div>
          <div class="flex justify-between items-start mb-6">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 bg-blue-500/10 text-blue-400">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
          </div>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 z-10 relative">Total Telemetry</h3>
          <div class="text-2xl lg:text-3xl font-bold text-white tracking-tight z-10 relative mb-4">{{ payments().length }}</div>
          <div class="pt-4 border-t border-white/10">
            <span class="text-[10px] font-bold uppercase text-slate-500 tracking-widest">HISTORICAL DATABASE</span>
          </div>
        </div>

        <div class="glass-panel p-6 relative overflow-hidden group hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" (click)="filterByStatus('failed')">
          <div class="absolute inset-0 bg-gradient-to-br from-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 to-transparent"></div>
          <div class="flex justify-between items-start mb-6">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 bg-red-500/10 text-red-400">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
          </div>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 z-10 relative">Anomaly Count</h3>
          <div class="text-2xl lg:text-3xl font-bold text-red-500 tracking-tight z-10 relative mb-4">{{ failedCount() }}</div>
          <div class="pt-4 border-t border-white/10">
            <span class="text-[10px] font-bold uppercase text-red-500 tracking-widest">REQUIRES ATTENTION</span>
          </div>
        </div>
      </div>

      <!-- HD Table Context -->
      <div class="glass-panel p-0 overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between p-6 lg:p-10 border-b border-white/5 bg-white/[0.02] gap-8">
          <div class="flex gap-4 items-center w-full md:w-auto overflow-x-auto pb-4 md:pb-0">
            <div class="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 shrink-0">
              <button class="px-5 py-2 rounded-xl text-xs font-bold transition-all"
                [ngClass]="statusFilter() === 'all' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'text-slate-400 hover:text-white'"
                (click)="filterByStatus('all')">Universal</button>
              <button class="px-5 py-2 rounded-xl text-xs font-bold transition-all"
                [ngClass]="statusFilter() === 'pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' : 'text-slate-400 hover:text-white'"
                (click)="filterByStatus('pending')">Pending</button>
              <button class="px-5 py-2 rounded-xl text-xs font-bold transition-all"
                [ngClass]="statusFilter() === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'text-slate-400 hover:text-white'"
                (click)="filterByStatus('completed')">Verified</button>
            </div>
          </div>
          
          <div class="flex items-center gap-4 w-full md:w-auto flex-1 md:max-w-xl">
            <div class="relative w-full group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input type="text" placeholder="Query transaction by Reference, PIN or amount..." (input)="filterPayments($event)"
                     class="w-full bg-slate-900/50 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-emerald-500/50 focus:bg-slate-900 transition-all placeholder-slate-500">
            </div>
            <button class="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all" (click)="exportPayments()" title="Export Ledger">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </button>
          </div>
        </div>

        @if (loading()) {
          <div class="p-10 lg:p-20 space-y-8">
            <app-skeleton-loader type="table"></app-skeleton-loader>
            <app-skeleton-loader type="table"></app-skeleton-loader>
            <app-skeleton-loader type="table"></app-skeleton-loader>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-white/10 bg-white/[0.02]">
                  <th class="px-6 py-4">Transaction Ref</th>
                  <th class="px-6 py-4">Taxpayer Entity</th>
                  <th class="px-6 py-4">Fiscal Value</th>
                  <th class="px-6 py-4">Channel</th>
                  <th class="px-6 py-4">Timestamp</th>
                  <th class="px-6 py-4 text-center">Operation</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 disabled-text-selection">
                @for (payment of filteredPayments(); track payment.id) {
                  <tr class="group hover:bg-white/[0.02] transition-colors">
                    <td class="px-6 py-5">
                      <div class="flex flex-col gap-1">
                        <span class="font-bold text-white">#{{ payment.id }}</span>
                        <span class="text-[10px] font-mono text-slate-500 tracking-wider"><span class="text-emerald-500 opacity-60">ID:</span> {{ payment.transaction_id || 'LOCAL-SYNC' }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-5">
                      <span class="font-semibold text-white">{{ payment.taxpayerName }}</span>
                    </td>
                    <td class="px-6 py-5">
                      <span class="font-bold text-emerald-400">KES {{ payment.amount | number:'1.2-2' }}</span>
                    </td>
                    <td class="px-6 py-5">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10">
                        {{ payment.paymentMethod }}
                      </span>
                    </td>
                    <td class="px-6 py-5">
                      <span class="text-slate-400 font-medium text-sm">{{ payment.paymentDate | date:'medium' }}</span>
                    </td>
                    <td class="px-6 py-5 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button class="p-2 text-slate-500 hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-400/10" (click)="viewPayment(payment)" title="View Intel">
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        @if (payment.status === 'completed') {
                          <button class="p-2 text-slate-500 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-400/10" (click)="downloadReceipt(payment)" title="Get Receipt">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6">
                      <div class="py-24 text-center flex flex-col items-center justify-center">
                        <div class="w-20 h-20 mb-6 bg-white/5 rounded-3xl flex items-center justify-center text-slate-600">
                          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">Null Telemetry</h3>
                        <p class="text-slate-400 max-w-sm">No financial telemetry detected in this segment. Execute a new transaction to begin tracking.</p>
                        <button class="btn-primary mt-8 py-3 px-6 shadow-lg shadow-emerald-500/25 bg-emerald-600 hover:bg-emerald-500" (click)="togglePaymentForm()">Execute First Transaction</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- HD Pagination -->
          <div class="flex flex-col sm:flex-row items-center justify-between p-6 lg:p-10 bg-white/[0.02] border-t border-white/5 gap-4">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Displaying telemetry segment <span class="text-emerald-500">{{ currentPage() }}</span> / {{ totalPages() }}</span>
            <div class="flex items-center gap-3">
              <button class="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider bg-slate-800" [disabled]="currentPage() === 1" (click)="previousPage()">PRESCIND</button>
              <button class="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider bg-slate-800" [disabled]="currentPage() === totalPages()" (click)="nextPage()">ADVANCE</button>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- HD Payment Details Modal -->
    @if (selectedPayment()) {
      <div class="dialog-overlay-elite animate-fade-in" (click)="selectedPayment.set(null)">
        <div class="glass-panel !p-0 max-w-xl w-full mx-4 shadow-2xl relative overflow-hidden" (click)="$event.stopPropagation()">
            <div class="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div class="p-8 border-b border-white/10 bg-white/[0.02] flex items-center justify-between relative z-10">
              <div>
                <h3 class="text-xl font-black text-white tracking-tight uppercase tracking-widest">Transaction <span class="text-emerald-500">Intel</span></h3>
                <p class="text-slate-400 text-sm mt-1">Secure Telemetry Signature Verification</p>
              </div>
              <button class="w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all" (click)="selectedPayment.set(null)">✕</button>
            </div>
          
          <div class="p-8 space-y-8 relative z-10">
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
               <div>
                 <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Protocol Status</div>
                 <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none border"
                        [ngClass]="{
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': selectedPayment()?.status === 'completed',
                          'bg-amber-500/10 text-amber-400 border-amber-500/20': selectedPayment()?.status === 'pending',
                          'bg-red-500/10 text-red-400 border-red-500/20': selectedPayment()?.status === 'failed',
                          'bg-slate-500/10 text-slate-400 border-slate-500/20': selectedPayment()?.status === 'cancelled'
                        }">
                    <span class="w-1.5 h-1.5 rounded-full"
                          [ngClass]="{
                            'bg-emerald-500': selectedPayment()?.status === 'completed',
                            'bg-amber-500 animate-pulse': selectedPayment()?.status === 'pending',
                            'bg-red-500': selectedPayment()?.status === 'failed',
                            'bg-slate-500': selectedPayment()?.status === 'cancelled'
                          }"></span>
                    {{ selectedPayment()?.status }}
                 </span>
               </div>
               <div class="sm:text-right">
                 <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Timestamp</div>
                 <div class="text-sm font-semibold text-white">{{ selectedPayment()?.paymentDate | date:'medium' }}</div>
               </div>
            </div>
            
            <div class="grid grid-cols-2 gap-8">
               <div class="space-y-2">
                 <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fiscal Value</div>
                 <div class="text-2xl font-black text-emerald-400">KES {{ selectedPayment()?.amount | number:'1.2-2' }}</div>
               </div>
               <div class="space-y-2 text-right border-l border-white/10 pl-8">
                 <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment Channel</div>
                 <div class="text-xl font-bold text-white">{{ selectedPayment()?.paymentMethod | uppercase }}</div>
               </div>
            </div>

            <div class="space-y-3 pt-8 border-t border-white/10">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Signature Hash</div>
              <div class="text-xs font-mono font-medium text-slate-300 bg-slate-900/80 p-5 rounded-xl border border-white/5 break-all select-all flex items-center justify-between group">
                {{ selectedPayment()?.transaction_id || selectedPayment()?.id || 'UNASSIGNED-SYNC' }}
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </div>
            </div>
          </div>

          <div class="p-8 bg-white/[0.02] border-t border-white/10 flex flex-col-reverse sm:flex-row justify-end gap-4 relative z-10">
            <button class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors" (click)="selectedPayment.set(null)">DISMISS INTEL</button>
            @if (selectedPayment()?.status === 'completed') {
              <button class="btn-primary py-3 px-6 shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-500" (click)="downloadReceipt(selectedPayment()!)">GENERATE RECEIPT</button>
            }
          </div>
        </div>
      </div>
    }

    <app-toast-container #toastContainer></app-toast-container>
  `,
  styles: [`
    .dialog-overlay-elite { position: fixed; inset: 0; background: var(--bg-overlay); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .animate-scale-in { animation: scaleIn var(--duration-base) var(--ease-out); }
  `]
})
export class PaymentsEnhancedComponent implements OnInit {
  @ViewChild('toastContainer') toastContainer!: ToastContainerComponent;

  private paymentService = inject(PaymentService);
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  // State Signals
  payments = signal<Payment[]>([]);
  loading = signal(false);
  showPaymentForm = signal(false);
  selectedPayment = signal<Payment | null>(null);
  statusFilter = signal<'all' | 'pending' | 'completed' | 'failed'>('all');
  searchQuery = signal('');
  sortColumn = signal('paymentDate');
  sortAsc = signal(false);
  currentPage = signal(1);
  itemsPerPageValue = signal('10');

  // Computed Properties
  filteredPayments = computed(() => {
    const status = this.statusFilter();
    const query = this.searchQuery().toLowerCase();
    let filtered = this.payments();

    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }

    if (query) {
      filtered = filtered.filter(p =>
        p.taxpayerName.toLowerCase().includes(query) ||
        (p.prn && p.prn.toLowerCase().includes(query)) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(query)) ||
        p.amount.toString().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      const col = this.sortColumn() as keyof Payment;
      const aVal = a[col];
      const bVal = b[col];

      if (!aVal || !bVal) return 0;
      if (aVal === bVal) return 0;
      const cmp = aVal > bVal ? 1 : -1;
      return this.sortAsc() ? cmp : -cmp;
    });

    const itemsPerPage = parseInt(this.itemsPerPageValue());
    const start = (this.currentPage() - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  });

  pendingCount = computed(() => this.payments().filter(p => p.status === 'pending').length);
  completedCount = computed(() => this.payments().filter(p => p.status === 'completed').length);
  failedCount = computed(() => this.payments().filter(p => p.status === 'failed').length);

  totalPending = computed(() =>
    this.payments()
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0)
  );

  totalCompleted = computed(() =>
    this.payments()
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
  );

  totalPages = computed(() => {
    const status = this.statusFilter();
    const query = this.searchQuery().toLowerCase();
    
    let filteredCount = this.payments().filter(p => {
      const matchStatus = status === 'all' || p.status === status;
      const matchQuery = !query || 
        p.taxpayerName.toLowerCase().includes(query) ||
        (p.prn && p.prn.toLowerCase().includes(query)) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(query)) ||
        p.amount.toString().includes(query);
      
      return matchStatus && matchQuery;
    }).length;

    const itemsPerPage = parseInt(this.itemsPerPageValue());
    return Math.ceil(filteredCount / itemsPerPage) || 1;
  });

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading.set(true);
    this.apiService.get<any>('payments_enhanced_api.php?action=list').subscribe({
      next: (response) => {
        if (response.success && response.data?.payments) {
          this.payments.set(response.data.payments);
        } else {
          this.payments.set([]);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loading.set(false);
        this.showError('Failed to load payments');
      }
    });
  }

  refreshPayments(): void {
    this.loadPayments();
    this.showSuccess('Payments synchronized successfully');
  }

  togglePaymentForm(): void {
    this.showPaymentForm.update(v => !v);
  }

  filterByStatus(status: 'all' | 'pending' | 'completed' | 'failed'): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
  }

  filterPayments(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
  }

  sortByColumn(column: string): void {
    if (this.sortColumn() === column) {
      this.sortAsc.update(v => !v);
    } else {
      this.sortColumn.set(column);
      this.sortAsc.set(true);
    }
  }

  viewPayment(payment: Payment): void {
    this.selectedPayment.set(payment);
  }

  downloadReceipt(payment?: Payment): void {
    const currentPayment = payment || this.selectedPayment();
    if (!currentPayment) return;
    const finalUrl = `${environment.apiUrl}/download.php?type=payment&id=${currentPayment.id}&format=pdf`;
    window.open(finalUrl, '_blank');
    this.showSuccess(`Receipt for payment #${currentPayment.id} initiated`);
  }

  exportPayments(): void {
    this.showSuccess('Ledger export protocol initiated');
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  private showSuccess(message: string): void {
    if (this.toastContainer) {
      this.toastContainer.addToast({
        title: 'Protocol Success',
        message,
        type: 'success',
        duration: 5000,
        icon: '✓'
      });
    }
  }

  private showError(message: string): void {
    if (this.toastContainer) {
      this.toastContainer.addToast({
        title: 'Protocol Error',
        message,
        type: 'error',
        duration: 7000,
        dismissible: true,
        icon: '✕'
      });
    }
  }
}
