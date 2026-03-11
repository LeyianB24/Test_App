import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>
      
      <div class="db-inner">
        <header class="premium-header">
          <div class="header-main">
            <div class="header-tag">
              <span class="tag-glow"></span>
              <span class="tag-text">Communications Center Protocol</span>
            </div>
            <h1 class="premium-title">Tactical <span class="red-gradient">Correspondence</span></h1>
            <p class="premium-subtitle">Authorized gateway for official notices, legal documents, and system directives</p>
          </div>
        </header>

        <div class="registry-layout">
          <!-- Registry Sidebar -->
          <aside class="registry-sidebar">
             <div class="elite-card nav-card">
                <h3 class="nav-title">REGISTRY SEGMENTS</h3>
                <nav class="nav-stack">
                   @for (cat of categories; track cat.id) {
                      <button 
                         class="nav-item" 
                         [class.active]="activeCategory() === cat.id"
                         (click)="activeCategory.set(cat.id)"
                      >
                         <span class="nav-label">{{ cat.label }}</span>
                         <span class="nav-badge">{{ cat.count }}</span>
                         <div class="nav-active-trace"></div>
                      </button>
                   }
                </nav>
             </div>

             <div class="elite-card action-promo-card">
                <div class="promo-glow"></div>
                <h4 class="promo-title">LEGAL APPEALS</h4>
                <p class="promo-text">You have a statutory 30-day window from assessment issuance to lodge a formal objection protocol.</p>
                <button class="btn-primary-elite w-full">LODGE OBJECTION</button>
             </div>
          </aside>

          <!-- Notices Terminal -->
          <main class="notices-terminal">
             <div class="terminal-stack">
                @for (notice of filteredNotices(); track notice.id) {
                   <div class="elite-card notice-row group" [class.unread]="!notice.read">
                      <div class="row-glow"></div>
                      <div class="row-content">
                         <div class="icon-signal-wrap">
                            <div class="icon-box">
                               <svg class="notice-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" [attr.d]="notice.icon" /></svg>
                            </div>
                            @if (!notice.read) {
                               <div class="unread-dot"></div>
                            }
                         </div>

                         <div class="row-main">
                            <div class="row-header">
                               <div class="header-info">
                                  <h4 class="notice-title">{{ notice.title }}</h4>
                                  <div class="notice-meta">
                                     <span class="ref-tag">{{ notice.ref }}</span>
                                     <span class="divider"></span>
                                     <span class="cat-label">{{ notice.category }}</span>
                                  </div>
                               </div>
                               <span class="date-label">{{ notice.date | date:'dd MMM yyyy' }}</span>
                            </div>
                            
                            <p class="notice-excerpt">{{ notice.excerpt }}</p>
                            
                            <div class="row-footer">
                               <button class="btn-text-elite">AUDIT DETAILS</button>
                               <button class="btn-ghost-elite">
                                  DOWNLOAD PDF ARCHIVE
                                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                } @empty {
                   <div class="empty-notices">
                      <div class="empty-icon-wrap">
                         <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      </div>
                      <h3 class="empty-title">REGISTRY CRYSTAL CLEAR</h3>
                      <p class="empty-text">No correspondence detected in this segment.</p>
                   </div>
                }
             </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      --red: #D92B2B;
      --red-bright: #EF3B3B;
      --red-glow: rgba(217, 43, 43, 0.4);
      --red-pale: rgba(217, 43, 43, 0.1);
      --red-border: rgba(217, 43, 43, 0.2);
      --bg-root: #080809;
      --bg-card: rgba(18, 18, 20, 0.6);
      --bdr: rgba(255, 255, 255, 0.05);
      --text-muted: #666670;
    }

    .db-root { 
      min-height: 100vh; 
      background: #050505 url('/assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      color: #fff; 
      position: relative; 
      overflow-x: hidden; 
      padding-bottom: 5rem;
    }
    
    .db-root::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(217, 43, 43, 0.1), transparent 40%),
                  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.02; z-index: 2; pointer-events: none; }

    .db-inner { 
      max-width: 1600px; 
      margin: 0 auto; 
      padding: 60px 40px; 
      display: flex; 
      flex-direction: column; 
      gap: 50px; 
      position: relative; 
      z-index: 10; 
    }

    /* Header Enhancement */
    .premium-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
      margin-bottom: 40px;
    }
    .header-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px; background: var(--red-pale);
      border: 1px solid var(--red-border); border-radius: 100px;
      margin-bottom: 16px;
    }
    .tag-glow { width: 6px; height: 6px; background: var(--red); border-radius: 50%; box-shadow: 0 0 10px var(--red); }
    .tag-text { font-size: 10px; font-weight: 950; color: var(--red-bright); letter-spacing: 2px; text-transform: uppercase; }

    .premium-title { font-size: 48px; font-weight: 950; letter-spacing: -2px; line-height: 1; margin: 0; }
    .red-gradient { background: linear-gradient(to right, #fff, var(--red-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .premium-subtitle { color: var(--text-muted); font-size: 14px; font-weight: 500; margin: 12px 0 0; letter-spacing: 0.5px; }

    .registry-layout { display: grid; grid-template-columns: 320px 1fr; gap: 32px; align-items: start; }

    /* Sidebar Architecture */
    .registry-sidebar { display: flex; flex-direction: column; gap: 24px; }
    .nav-card { 
      padding: 24px; 
      background: rgba(20, 20, 20, 0.4);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08); 
      border-radius: 32px; 
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .nav-title { font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; margin-bottom: 24px; text-transform: uppercase; }

    .nav-stack { display: flex; flex-direction: column; gap: 8px; }
    .nav-item {
       width: 100%; padding: 16px; display: flex; justify-content: space-between; align-items: center;
       background: rgba(255,255,255,0.02); border: 1px solid var(--bdr); border-radius: 16px;
       color: var(--text-muted); cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden;
    }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
    .nav-item.active { background: var(--red); color: #fff; border-color: var(--red); box-shadow: 0 8px 16px var(--red-glow); }
    .nav-label { font-size: 11px; font-weight: 950; text-transform: uppercase; letter-spacing: 1px; position: relative; z-index: 1; }
    .nav-badge { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 900; background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 6px; position: relative; z-index: 1; }
    .nav-active-trace { position: absolute; inset: 0; background: linear-gradient(to right, transparent, rgba(255,255,255,0.1)); opacity: 0; transition: opacity 0.3s; }
    .nav-item.active .nav-active-trace { opacity: 1; }

    .action-promo-card { padding: 32px; background: var(--red-pale); border: 1px solid var(--red-border); border-radius: 24px; position: relative; overflow: hidden; }
    .promo-glow { position: absolute; inset: -20px; background: radial-gradient(circle at top right, var(--red), transparent 70%); opacity: 0.2; }
    .promo-title { font-size: 16px; font-weight: 950; margin: 0 0 12px; position: relative; z-index: 1; letter-spacing: -0.5px; }
    .promo-text { font-size: 11px; font-weight: 600; color: #aaa; margin: 0 0 24px; line-height: 1.6; text-transform: uppercase; letter-spacing: 0.5px; position: relative; z-index: 1; }
    
    .btn-primary-elite {
       height: 52px; background: var(--red); color: #fff; border: none; border-radius: 14px;
       font-size: 10px; font-weight: 950; letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s;
       box-shadow: 0 8px 16px var(--red-glow); position: relative; z-index: 1;
    }
    .btn-primary-elite:hover { transform: translateY(-2px); box-shadow: 0 12px 24px var(--red-glow); }

    /* Terminal Row Architecture */
    .terminal-stack { display: flex; flex-direction: column; gap: 20px; }
    .notice-row { 
      padding: 32px; 
      background: rgba(20, 20, 20, 0.4); 
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08); 
      border-radius: 32px; 
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative; 
      overflow: hidden; 
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .notice-row:hover { 
      background: rgba(20, 20, 20, 0.6);
      border-color: rgba(217, 43, 43, 0.3); 
      transform: translateX(12px) scale(1.01); 
      box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    }
    .row-glow { position: absolute; bottom: -50px; left: -50px; width: 150px; height: 150px; background: radial-gradient(circle, var(--red-pale) 0%, transparent 70%); opacity: 0; transition: opacity 0.4s; }
    .notice-row:hover .row-glow { opacity: 1; }

    .row-content { display: flex; gap: 24px; position: relative; z-index: 1; }
    
    .icon-signal-wrap { position: relative; height: fit-content; }
    .icon-box { width: 56px; height: 56px; border-radius: 16px; background: #000; border: 1px solid var(--bdr); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.3s; }
    .notice-row:hover .icon-box { background: var(--red-pale); border-color: var(--red-border); color: var(--red-bright); }
    .notice-icon { width: 24px; height: 24px; }
    .unread-dot { position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; background: var(--red-bright); border: 2px solid #000; border-radius: 50%; box-shadow: 0 0 10px var(--red); }

    .row-main { flex-grow: 1; }
    .row-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .notice-title { font-size: 18px; font-weight: 950; margin: 0; letter-spacing: -0.5px; transition: color 0.3s; }
    .notice-row:hover .notice-title { color: var(--red-bright); }

    .notice-meta { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
    .ref-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 900; color: #666; background: rgba(255,255,255,0.03); padding: 2px 8px; border-radius: 4px; }
    .divider { width: 4px; height: 4px; border-radius: 50%; background: var(--bdr); }
    .cat-label { font-size: 10px; font-weight: 950; color: var(--red-bright); opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; }

    .date-label { font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 1.5px; }

    .notice-excerpt { font-size: 13px; font-weight: 600; color: #888; margin: 0 0 24px; line-height: 1.6; max-width: 90%; }

    .row-footer { display: flex; justify-content: flex-end; gap: 16px; }
    .btn-text-elite { background: none; border: none; font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; cursor: pointer; transition: color 0.3s; }
    .btn-text-elite:hover { color: #fff; }
    
    .btn-ghost-elite { 
       padding: 8px 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--bdr); border-radius: 10px;
       font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 1.5px; cursor: pointer;
       transition: all 0.3s; display: flex; align-items: center; gap: 8px;
    }
    .btn-ghost-elite:hover { background: var(--red-pale); border-color: var(--red-border); color: var(--red-bright); }

    .empty-notices { padding: 120px 0; text-align: center; }
    .empty-icon-wrap { width: 80px; height: 80px; background: rgba(0,0,0,0.3); border: 1px solid var(--bdr); border-radius: 30px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: var(--text-muted); }
    .empty-title { font-size: 11px; font-weight: 950; color: #fff; letter-spacing: 4px; margin: 0 0 8px; }
    .empty-text { font-size: 13px; color: var(--text-muted); font-weight: 500; }

    @media (max-width: 1024px) {
       .registry-layout { grid-template-columns: 1fr; }
       .notice-row:hover { transform: none; }
    }
  `],
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
