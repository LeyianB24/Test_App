import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-pin-certificate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pin-cert-container p-6 animate-fade-in">
      <header class="mb-10 text-center">
        <h1 class="text-3xl font-bold text-white mb-2">PIN Registration Certificate</h1>
        <p class="text-slate-400">View and download your official KRA PIN registration details.</p>
      </header>

      <div class="max-w-4xl mx-auto">
        <div class="glass-card p-0 overflow-hidden border border-white/10 shadow-2xl relative">
          <!-- Decorative Stamp -->
          <div class="absolute top-10 right-10 w-24 h-24 border-4 border-emerald-500/20 rounded-full flex items-center justify-center -rotate-12 select-none pointer-events-none">
             <div class="text-[10px] font-bold text-emerald-500/30 text-center leading-tight">OFFICIAL<br>KRA DOCUMENT</div>
          </div>

          <!-- Header Section -->
          <div class="bg-slate-900/80 p-8 border-b border-white/5 flex items-center justify-between">
             <div class="flex items-center">
                <img src="assets/logo.png" class="w-16 h-16 mr-6 object-contain" alt="KRA Logo">
                <div>
                   <h2 class="text-white font-bold text-xl uppercase tracking-wider">Kenya Revenue Authority</h2>
                   <p class="text-[10px] text-slate-400 uppercase tracking-[0.2em]">PIN Registration Certificate</p>
                </div>
             </div>
             <div class="text-right">
                <div class="text-[10px] text-slate-500 uppercase font-bold mb-1">Taxpayer PIN</div>
                <div class="text-2xl font-mono font-bold text-blue-400">{{ pin() }}</div>
             </div>
          </div>

          <!-- Main Content -->
          <div class="p-10 bg-gradient-to-b from-slate-900/40 to-slate-900/60">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div class="space-y-6">
                   <div class="info-block">
                      <label class="info-label">Taxpayer Name</label>
                      <div class="info-value">{{ userName() }}</div>
                   </div>
                   <div class="info-block">
                      <label class="info-label">Taxpayer Type</label>
                      <div class="info-value uppercase">{{ userType() }}</div>
                   </div>
                   <div class="info-block">
                      <label class="info-label">Address</label>
                      <div class="info-value text-sm leading-relaxed">
                         {{ pinData.address }}<br>
                         {{ pinData.location }}<br>
                         {{ pinData.county }}
                      </div>
                   </div>
                </div>

                <div class="space-y-6">
                   <div class="info-block">
                      <label class="info-label">Registration Date</label>
                      <div class="info-value">{{ pinData.regDate }}</div>
                   </div>
                   <div class="info-block">
                      <label class="info-label">Tax Obligations</label>
                      <div class="flex flex-wrap gap-2 mt-2">
                         @for (ob of pinData.obligations; track ob) {
                            <span class="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/20">
                               {{ ob }}
                            </span>
                         }
                      </div>
                   </div>
                </div>
             </div>

             <!-- Signature/QR Area -->
             <div class="mt-16 pt-10 border-t border-white/10 flex justify-between items-end">
                <div class="text-slate-500 text-[10px]">
                   <p class="mb-1 italic">This is a computer-generated certificate and does not require a physical signature.</p>
                   <p>Verification Code: <span class="text-blue-400 font-mono">X72-B91-Q0P</span></p>
                </div>
                <div class="w-20 h-20 bg-white p-1 rounded-sm">
                   <!-- QR Placeholder -->
                   <div class="w-full h-full bg-slate-200 flex items-center justify-center">
                      <svg class="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3-6h1.5v1.5H18V13zm3 0h1.5v1.5H21V13z" /></svg>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div class="mt-10 flex gap-4 justify-center">
           <button class="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-blue-600/20 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download PDF Certificate
           </button>
           <button class="px-8 py-3 border border-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl transition-all">
              Update Information
           </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(20px);
      border-radius: 4px; /* Paper-like corner */
    }
    .info-label {
      color: #64748b;
      text-transform: uppercase;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
      display: block;
    }
    .info-value {
      color: white;
      font-weight: 600;
      font-size: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinCertificateComponent {
  private authService = inject(AuthService);

  pin = signal('A019882736G');
  userName = this.authService.userName;
  userType = this.authService.userType;

  pinData = {
    address: 'P.O BOX 12345',
    location: 'UPPERHILL, NAIROBI',
    county: 'NAIROBI COUNTY',
    regDate: '2023-01-15',
    obligations: [
       'Income Tax - Resident Individual',
       'Value Added Tax (VAT)',
       'Monthly Rental Income (MRI)'
    ]
  };
}
