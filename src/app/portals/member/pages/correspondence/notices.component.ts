import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notices',
  imports: [CommonModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                COMMUNICATIONS CENTER
              </span>
            </div>
            <h1 class="premium-title">Tactical <span class="gradient-text">Correspondence</span></h1>
            <p class="premium-subtitle">Authorized gateway for official notices, legal documents, and system directives</p>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1 flex flex-col gap-6">
           <div class="glass-panel p-6 border-white/5 bg-white/[0.01]">
              <h3 class="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.2em]">Registry Segments</h3>
              <div class="flex flex-col gap-2">
                 @for (cat of categories; track cat.id) {
                    <button 
                      class="w-full flex justify-between items-center p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden" 
                      [class.bg-blue-600]="activeCategory() === cat.id" 
                      [class.bg-white/[0.02]]="activeCategory() !== cat.id"
                      [class.hover:bg-white/[0.05]]="activeCategory() !== cat.id"
                      (click)="activeCategory.set(cat.id)"
                    >
                       <span class="text-xs font-black uppercase tracking-widest relative z-10" [class.text-white]="activeCategory() === cat.id" [class.text-slate-400]="activeCategory() !== cat.id">{{ cat.label }}</span>
                       <span class="px-2 py-1 rounded-lg text-[9px] font-black tracking-widest relative z-10 shadow-lg" [class.bg-white/20]="activeCategory() === cat.id" [class.bg-slate-900]="activeCategory() !== cat.id" [class.text-white]="activeCategory() === cat.id" [class.text-slate-600]="activeCategory() !== cat.id">{{ cat.count }}</span>
                       
                       @if (activeCategory() === cat.id) {
                         <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 animate-pulse opacity-20"></div>
                       }
                    </button>
                 }
              </div>
           </div>

           <div class="glass-panel p-8 relative overflow-hidden group border-blue-500/20 bg-blue-500/5">
              <div class="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
              
              <h4 class="text-sm font-black mb-3 text-white uppercase tracking-tighter relative z-10">Legal Appeals</h4>
              <p class="text-[10px] text-slate-400 leading-relaxed mb-6 uppercase tracking-widest font-bold opacity-80 relative z-10">You have a statutory 30-day window from assessment issuance to lodge a formal objection protocol.</p>
              
              <button class="modern-btn primary-btn w-full py-3 text-[10px] shadow-lg shadow-blue-500/20 relative z-10 elite-glow">Lodge Objection</button>
           </div>
        </div>

        <!-- Notices Terminal -->
        <div class="lg:col-span-3">
           <div class="flex flex-col gap-4">
              @for (notice of filteredNotices(); track notice.id) {
                <div class="glass-panel p-8 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                   <div class="absolute -bottom-16 -right-16 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-blue-500/5 transition-all duration-700"></div>
                   
                   <div class="flex flex-col md:flex-row gap-8 relative z-10">
                      <div class="w-16 h-16 rounded-[1.25rem] bg-slate-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-blue-500/30 group-hover:bg-blue-600/5 transition-all duration-500 shadow-2xl">
                         <svg class="w-8 h-8 transition-all duration-500 group-hover:scale-110" [class.text-slate-600]="notice.read" [class.text-blue-400]="!notice.read" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="notice.icon" />
                         </svg>
                         @if (!notice.read) {
                            <div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-slate-950 shadow-lg shadow-blue-500/50 animate-pulse"></div>
                         }
                      </div>

                      <div class="flex-grow">
                         <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                            <div>
                               <h4 class="text-lg font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors uppercase">{{ notice.title }}</h4>
                               <div class="flex items-center gap-3 mt-2">
                                  <span class="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest">{{ notice.ref }}</span>
                                  <div class="w-1 h-1 rounded-full bg-slate-700"></div>
                                  <span class="text-[9px] text-blue-500/50 font-black uppercase tracking-widest">{{ notice.category }}</span>
                               </div>
                            </div>
                            <span class="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] bg-white/[0.02] px-3 py-1 rounded-full border border-white/5">{{ notice.date | date:'dd MMM yyyy' }}</span>
                         </div>
                         
                         <p class="text-slate-400 text-sm leading-relaxed mb-8 max-w-2xl font-medium line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">{{ notice.excerpt }}</p>
                         
                         <div class="flex justify-end items-center gap-6">
                            <button class="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all">Audit Details</button>
                            <button class="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-2 group/btn transition-all">
                               Download PDF Archive
                               <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="transition-transform group-hover/btn:translate-y-0.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                            </button>
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
    :host { display: block; }
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

  filteredNotices = computed(() => {
    if (this.activeCategory() === 'all') return this.notices;
    return this.notices.filter(n => n.category === this.activeCategory());
  });
}
