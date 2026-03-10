import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService, UserProfile } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgOptimizedImage],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      
      <div class="content-area animate-stagger">
        
        <!-- Identity Header Manifold -->
        <header class="mb-14 overflow-hidden relative group">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
            <div class="space-y-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]"></div>
                <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Administrative Credential Control</span>
              </div>
              <h1 class="text-5xl font-black text-primary tracking-tighter uppercase leading-none">
                Identity <span class="text-stroke-sm">Matrix</span>
              </h1>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                SECURE AUTHENTICATION NODE // TERMINAL: ID-KRA-NODE-01
              </p>
            </div>

            <div class="flex items-center gap-6">
               <button (click)="openEditOverlay()" class="btn-precision online !bg-white/5 !border-white/10 !text-primary hover:!bg-accent/10 hover:!border-accent/40 !px-10 transition-all">
                  RECALIBRATE IDENTITY
               </button>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           <!-- Identity Card Luxury -->
           <div class="lg:col-span-12 xl:col-span-8">
              <div class="glass-panel p-1 border-white/10 shadow-2xl relative group overflow-hidden bg-gradient-to-br from-white/[0.05] to-transparent">
                 <div class="p-12 md:p-16 flex flex-col md:flex-row gap-14 relative z-10">
                    
                    <!-- Profile Avatar Projection -->
                    <div class="relative shrink-0">
                       <div class="w-48 h-48 rounded-[3.5rem] bg-surface-2 border border-white/10 overflow-hidden relative group/avatar">
                          <div class="absolute inset-0 bg-accent/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
                          @if (profile()?.profile_image) {
                            <img [src]="profile()?.profile_image" alt="Admin Avatar" class="w-full h-full object-cover">
                          } @else {
                            <div class="w-full h-full flex items-center justify-center text-4xl font-black text-primary bg-white/5">
                               {{ profile()?.name?.substring(0, 2)?.toUpperCase() }}
                            </div>
                          }
                          <div class="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[var(--color-success)] border-4 border-[#050505] shadow-[0_0_15px_var(--color-success)]"></div>
                       </div>
                       <div class="mt-8 text-center md:text-left space-y-2">
                          <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Rank Identifier</span>
                          <p class="text-sm font-black text-primary uppercase tracking-widest">{{ profile()?.role || 'SYSTEM ADMIN' }}</p>
                       </div>
                    </div>

                    <!-- Credential Fragments -->
                    <div class="flex-1 space-y-12">
                       <div class="space-y-2">
                          <h2 class="text-4xl font-black text-primary uppercase tracking-tighter">{{ profile()?.name }}</h2>
                          <div class="flex flex-wrap items-center gap-4">
                             <div class="status-pill-precision online !px-3 !py-1 text-[8px]">PRIMARY ACCOUNT</div>
                             <span class="text-[11px] font-black text-muted tracking-widest uppercase">{{ profile()?.email }}</span>
                          </div>
                       </div>

                       <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
                          <div class="space-y-2">
                             <span class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Administrative PIN</span>
                             <div class="flex items-center gap-4">
                                <span class="text-lg font-black text-primary tracking-widest font-mono uppercase">{{ profile()?.taxpayer_id || 'A000000000X' }}</span>
                                <button (click)="copyPin()" class="text-accent hover:text-primary transition-colors">
                                   <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                </button>
                             </div>
                          </div>
                          <div class="space-y-2">
                             <span class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Node Cluster</span>
                             <p class="text-lg font-black text-primary tracking-tighter uppercase">{{ profile()?.station || 'NAIROBI NORTH COMMAND' }}</p>
                          </div>
                          <div class="space-y-2">
                             <span class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Communication Vector</span>
                             <p class="text-lg font-black text-primary tracking-tighter tabular-nums">{{ profile()?.phone || '+254 XXX XXX XXX' }}</p>
                          </div>
                          <div class="space-y-2">
                             <span class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Physical Registry</span>
                             <p class="text-lg font-black text-primary tracking-tighter uppercase truncate max-w-[200px]">{{ profile()?.address || 'TIMES TOWER, NRB' }}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <!-- Background Chips Decoration -->
                 <div class="absolute top-10 right-10 w-4 h-20 bg-accent/10 skew-x-[45deg] blur-sm"></div>
                 <div class="absolute top-10 right-20 w-8 h-20 bg-primary/5 skew-x-[45deg] blur-sm"></div>
              </div>
           </div>

           <!-- Sidebar Telemetry -->
           <div class="lg:col-span-12 xl:col-span-4 space-y-10">
              
              <!-- Verification Flux -->
              <div class="glass-panel p-10 space-y-10 bg-white/[0.01] border-white/5">
                 <h4 class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Security Integrity</h4>
                 <div class="flex items-center gap-8">
                    <div class="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                       <svg viewBox="0 0 36 36" class="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="18" cy="18" r="16" fill="none" class="stroke-accent" stroke-width="4" stroke-dasharray="100, 100" stroke-dashoffset="15"></circle>
                       </svg>
                       <span class="text-[10px] font-black text-primary">85%</span>
                    </div>
                    <div class="space-y-1">
                       <span class="text-xs font-black text-primary uppercase tracking-tighter">Bio-Shield Sync</span>
                       <p class="text-[9px] font-black text-muted uppercase tracking-widest opacity-60">High Integrity Factor</p>
                    </div>
                 </div>
                 <div class="space-y-4 pt-4">
                    <div class="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                       <span class="text-[9px] font-black text-muted uppercase tracking-widest">2FA STATUS</span>
                       <span class="text-[9px] font-black text-[var(--color-success)] uppercase tracking-widest">ENABLED</span>
                    </div>
                    <div class="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                       <span class="text-[9px] font-black text-muted uppercase tracking-widest">ENCRYPTION LVL</span>
                       <span class="text-[9px] font-black text-accent uppercase tracking-widest">TIER-X</span>
                    </div>
                 </div>
              </div>

              <!-- Certificate Extraction -->
              <button (click)="downloadCertificate()" class="w-full glass-panel p-8 text-left hover:border-accent/40 transition-all group/cert relative overflow-hidden">
                 <div class="absolute inset-0 bg-accent/5 opacity-0 group-hover/cert:opacity-100 transition-opacity"></div>
                 <div class="flex items-center gap-8 relative z-10">
                    <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                       <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div class="space-y-1">
                       <span class="text-[11px] font-black text-primary uppercase tracking-widest block">Extract PIN Certificate</span>
                       <span class="text-[9px] font-black text-muted uppercase tracking-widest block opacity-60">Authorized PDF Vector</span>
                    </div>
                 </div>
              </button>
           </div>

        </div>
      </div>

      <!-- Identity Recalibration Overlay -->
      @if (showEditOverlay()) {
        <div class="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-3xl bg-black/80 animate-fade-in">
           <div class="w-full max-w-2xl glass-panel relative overflow-hidden animate-scale border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
              <div class="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                 <div class="space-y-2">
                    <div class="flex items-center gap-3">
                       <div class="w-1 h-4 bg-accent rounded-full"></div>
                       <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Secure Repositing</span>
                    </div>
                    <h2 class="text-4xl font-black text-primary uppercase tracking-tighter">Recalibrate Identity</h2>
                 </div>
                 <button (click)="closeEditOverlay()" class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-accent/10 transition-all flex items-center justify-center">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                 </button>
              </div>

              <form [formGroup]="editForm" (ngSubmit)="saveProfile()" class="p-12 space-y-12">
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div class="space-y-4">
                       <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Communication Vector</label>
                       <input type="text" formControlName="phone" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent outline-none tabular-nums font-mono">
                    </div>
                    <div class="space-y-4">
                       <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Digital Signature</label>
                       <input type="email" formControlName="email" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent outline-none">
                    </div>
                 </div>
                 <div class="space-y-4">
                    <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Registry Physical Vector</label>
                    <input type="text" formControlName="address" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent outline-none uppercase tracking-tight">
                 </div>

                 <div class="flex justify-end gap-6 pt-10 border-t border-white/5">
                    <button type="button" (click)="closeEditOverlay()" class="btn-precision online !bg-white/5 !border-white/10 !text-primary">ABORT COMMAND</button>
                    <button type="submit" [disabled]="submitting() || editForm.invalid" class="btn-precision online !bg-accent !text-white !border-none shadow-[0_0_20px_var(--color-accent)]">
                       {{ submitting() ? 'COMMITING...' : 'COMMIT PROFILE' }}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .db-root { 
      min-height: 100vh; 
      background: #050505 url('assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      color: #e2e8f0; 
      position: relative; 
      overflow-x: hidden; 
      padding: 3.5rem;
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

    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.015; z-index: 2; pointer-events: none; }

    .content-area {
      position: relative;
      z-index: 2;
      max-width: 1700px;
      margin: 0 auto;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 2.5rem;
    }

    .status-pill-precision {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255,255,255,0.03);
    }

    .online { color: #10b981; border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.05); }

    .text-stroke-sm {
      -webkit-text-stroke: 1px currentColor;
      color: transparent;
    }

    .animate-stagger > * {
      animation: stg 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes stg { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .animate-scale { animation: sc 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes sc { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .animate-fade-in { animation: fi 0.4s ease-out; }
    @keyframes fi { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class ProfileComponent implements OnInit {
  private authSvc = inject(AuthService);
  private fb = inject(FormBuilder);

  profile = signal<UserProfile | null>(null);
  showEditOverlay = signal(false);
  submitting = signal(false);

  editForm = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: ['']
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.authSvc.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.profile.set(res.data);
          this.editForm.patchValue({
             name: res.data.name,
             email: res.data.email,
             phone: res.data.phone,
             address: res.data.address
          });
        }
      }
    });
  }

  openEditOverlay() { this.showEditOverlay.set(true); }
  closeEditOverlay() { this.showEditOverlay.set(false); }

  saveProfile() {
    if (this.editForm.invalid) return;
    this.submitting.set(true);
    this.authSvc.updateProfile(this.editForm.value as any).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadProfile();
          this.closeEditOverlay();
        }
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false)
    });
  }

  copyPin() {
    const pin = this.profile()?.taxpayer_id || 'A000000000X';
    navigator.clipboard.writeText(pin);
    console.log('PIN copied to clipboard protocol');
  }

  downloadCertificate() {
     console.log('Initiating PIN certificate extraction protocol...');
  }
}
