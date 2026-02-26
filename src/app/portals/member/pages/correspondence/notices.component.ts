import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notices-container p-6 animate-fade-in">
      <header class="mb-10">
        <h1 class="text-3xl font-bold text-white mb-2">Correspondence & Notices</h1>
        <p class="text-slate-400">View official communications, assessment notices, and demand letters from KRA.</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Sidebar Filters -->
        <div class="lg:col-span-1 space-y-6">
           <div class="glass-card p-6">
              <h3 class="text-white font-bold mb-4 text-sm uppercase tracking-widest">Filter by Category</h3>
              <div class="space-y-2">
                 @for (cat of categories; track cat.id) {
                    <button class="w-full flex justify-between items-center p-3 rounded-xl transition-all group" [class.bg-blue-600]="activeCategory() === cat.id" [class.hover:bg-slate-800]="activeCategory() !== cat.id" (click)="activeCategory.set(cat.id)">
                       <span class="text-sm" [class.text-white]="activeCategory() === cat.id" [class.text-slate-400]="activeCategory() !== cat.id">{{ cat.label }}</span>
                       <span class="px-2 py-0.5 rounded-md text-[10px] font-bold" [class.bg-white/20]="activeCategory() === cat.id" [class.bg-slate-700]="activeCategory() !== cat.id" [class.text-white]="activeCategory() === cat.id" [class.text-slate-500]="activeCategory() !== cat.id">{{ cat.count }}</span>
                    </button>
                 }
              </div>
           </div>

           <div class="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-900/20">
              <h4 class="font-bold mb-2">Need to Appeal?</h4>
              <p class="text-xs text-white/80 leading-relaxed mb-4">You have 30 days from the date of an assessment notice to lodge a formal objection.</p>
              <button class="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all">Lodge Objection</button>
           </div>
        </div>

        <!-- Notices List -->
        <div class="lg:col-span-3">
           <div class="flex flex-col gap-4">
              @for (notice of filteredNotices(); track notice.id) {
                <div class="glass-card p-6 hover:border-blue-500/30 transition-all cursor-pointer group">
                   <div class="flex gap-6">
                      <div class="notice-icon w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600/10 transition-colors">
                         <svg class="w-7 h-7" [class.text-slate-500]="notice.read" [class.text-blue-500]="!notice.read" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="notice.icon" />
                         </svg>
                         @if (!notice.read) {
                            <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-900"></div>
                         }
                      </div>

                      <div class="flex-grow">
                         <div class="flex justify-between items-start mb-1">
                            <h4 class="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">{{ notice.title }}</h4>
                            <span class="text-[10px] text-slate-500 font-mono">{{ notice.date }}</span>
                         </div>
                         <p class="text-slate-400 text-sm mb-4 line-clamp-2">{{ notice.excerpt }}</p>
                         
                         <div class="flex justify-between items-center">
                            <div class="flex gap-3">
                               <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[9px] font-bold uppercase">{{ notice.ref }}</span>
                               <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] font-bold uppercase">{{ notice.category }}</span>
                            </div>
                            <div class="flex gap-4">
                               <button class="text-xs font-bold text-blue-400 hover:underline">Download PDF</button>
                               <button class="text-xs font-bold text-slate-400 hover:text-white">View Details</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              }
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticesComponent {
  activeCategory = signal('all');

  categories = [
    { id: 'all', label: 'All Correspondence', count: 12 },
    { id: 'assessments', label: 'Assessment Notices', count: 3 },
    { id: 'compliance', label: 'Compliance Letters', count: 5 },
    { id: 'acknowledgements', label: 'Acknowledgements', count: 4 }
  ];

  notices = [
    {
      id: 1,
      title: 'Notice of Assessment - VAT Period Jan 2026',
      date: '2026-02-18',
      excerpt: 'This is a formal notice of assessment for the VAT period ending Jan 2026. The total tax payable has been calculated based on your filing...',
      ref: 'KRA/VAT/2026/001',
      category: 'assessments',
      read: false,
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    {
      id: 2,
      title: 'TCC Application Approval acknowledgement',
      date: '2026-02-10',
      excerpt: 'Your application for Tax Compliance Certificate ref TCC-882-991 has been received and is currently under review by our compliance team...',
      ref: 'KRA/TCC/ACK/882',
      category: 'acknowledgements',
      read: true,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      id: 3,
      title: 'Reminder: IT1 Individual Return Filing',
      date: '2026-02-05',
      excerpt: 'Generic reminder for individual income tax return filing for the year 2025. Please ensure your returns are filed before the deadline...',
      ref: 'KRA/GEN/2026/012',
      category: 'compliance',
      read: true,
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    }
  ];

  filteredNotices() {
    if (this.activeCategory() === 'all') return this.notices;
    return this.notices.filter(n => n.category === this.activeCategory());
  }
}
