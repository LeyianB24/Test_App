import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed, Input, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardDataService } from '../../../../services/dashboard-data.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-pin-certificate',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="db-root print-container">
      <div class="noise-overlay no-print"></div>
      <div class="accent-bleed no-print"></div>

      <!-- ── Dashboard Header (Hidden on Print) ─────────────── -->
      <div class="db-inner no-print animate-stagger">
        <header class="db-header-elite">
          <div class="header-left">
            <div class="live-badge">
              <span class="live-dot"></span>
              STATUTORY REGISTRY ARCHIVE
            </div>
            <h1 class="premium-title">PIN <span class="text-red">Certificate</span></h1>
            <p class="premium-subtitle">Authorized verification of registered taxpayer status and fiscal obligations</p>
          </div>
          
          <div class="header-right flex-btns">
            <button class="btn-ghost-elite" (click)="print()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4"/></svg>
              PRINT RECORD
            </button>
            <button class="btn-primary-elite" (click)="downloadPdf()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              DOWNLOAD PDF
            </button>
          </div>
        </header>

        <!-- ── Official PIN Certificate Document ──────────────── -->
        <div id="pin-cert-doc" class="official-cert-paper">

          <!-- Hourglass Branding Bar (Left) -->
          <div id="branding-bar">
            <svg class="wedge-top" viewBox="0 0 1 1" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,0 1,0 0,1" fill="#000000"/>
            </svg>
            <svg class="wedge-bottom" viewBox="0 0 1 1" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,1 1,1 0,0" fill="#D92B2B"/>
            </svg>
          </div>

          <div class="cert-content-inner">
            <!-- Document Header -->
            <div class="cert-header">
               <div class="cert-header-left">
                  <img ngSrc="assets/logo.png" width="180" height="75" class="kra-logo-large" alt="KRA Logo" priority>
                  <span class="kra-url">www.kra.go.ke</span>
               </div>

               <div class="cert-title-box">
                  <div class="cert-title-bg">PIN Certificate</div>
               </div>

               <div class="cert-contact-info">
                  <div class="contact-header">For General Tax Questions</div>
                  <div class="contact-header">Contact KRA Call Centre</div>
                  <div class="contact-line">Tel: +254 (020) 4999 999</div>
                  <div class="contact-line">Cell: +254(0711)099 999</div>
                  <div class="contact-line">Email: callcentre&#64;kra.go.ke</div>
               </div>
            </div>

            <div class="cert-meta">
               <div class="meta-row">
                  <span class="meta-label">Certificate Date :</span>
                  <span class="meta-value">{{ today | date:'dd/MM/yyyy' }}</span>
               </div>
               <div class="meta-row">
                  <span class="meta-label">Personal Identification Number :</span>
                  <div class="meta-value pin-highlight">{{ taxpayerPin() }}</div>
               </div>
            </div>

            <div class="cert-certify">
               This is to certify that taxpayer shown herein has been registered with Kenya Revenue Authority
            </div>

            <!-- Section: Taxpayer Information -->
            <div class="cert-section">
               <h3 class="section-title">Taxpayer Information</h3>
               <table class="cert-table">
                  <tr>
                     <th width="35%">Taxpayer Name</th>
                     <td>{{ userName() }}</td>
                  </tr>
                  <tr>
                     <th>Email Address</th>
                     <td>{{ userEmail() }}</td>
                  </tr>
                  <tr>
                     <th>Taxpayer Type</th>
                     <td>{{ taxpayerType() }}</td>
                  </tr>
                  <tr>
                     <th>ID / Passport Number</th>
                     <td>{{ profile()?.id_number || 'N.A.' }}</td>
                  </tr>
                  @if (profile()?.dob) {
                    <tr>
                       <th>Date of Birth</th>
                       <td>{{ profile()?.dob | date:'dd/MM/yyyy' }}</td>
                    </tr>
                  }
                  <tr>
                     <th>Registration Date</th>
                     <td>{{ registrationDate() | date:'dd/MM/yyyy' }}</td>
                  </tr>
               </table>
            </div>

            <!-- Section: Registered Address -->
            <div class="cert-section">
               <h3 class="section-title">Registered Address</h3>
               <table class="cert-table grid-table">
                  <tr>
                     <th width="20%">L.R. Number :</th>
                     <td width="30%">N.A.</td>
                     <th width="20%">Building :</th>
                     <td width="30%">{{ profile()?.address || 'N.A.' }}</td>
                  </tr>
                  <tr>
                     <th>Street/Road :</th>
                     <td>{{ profile()?.address || 'N.A.' }}</td>
                     <th>City/Town :</th>
                     <td>{{ profile()?.town || 'N.A.' }}</td>
                  </tr>
                  <tr>
                     <th>County :</th>
                     <td>{{ profile()?.county || 'N.A.' }}</td>
                     <th>Sub-County :</th>
                     <td>{{ profile()?.sub_county || 'N.A.' }}</td>
                  </tr>
                  <tr>
                     <th>Tax Area :</th>
                     <td>{{ profile()?.ward || 'N.A.' }}</td>
                     <th>Station :</th>
                     <td>{{ station() }}</td>
                  </tr>
                  <tr>
                     <th>P. O. Box :</th>
                     <td>{{ profile()?.postal_address || 'N.A.' }}</td>
                     <th>Postal Code :</th>
                     <td>{{ profile()?.postal_code || 'N.A.' }}</td>
                  </tr>
               </table>
            </div>

            <!-- Section: Tax Obligation(s) Registration Details -->
            <div class="cert-section">
               <h3 class="section-title">Tax Obligation(s) Registration Details</h3>
               @if (obligations().length > 0) {
                  <table class="cert-table list-table">
                     <thead>
                        <tr>
                           <th width="8%">Sr. No.</th>
                           <th width="38%">Tax Obligation(s)</th>
                           <th width="18%">Effective From Date</th>
                           <th width="18%">Effective Till Date</th>
                           <th width="18%">Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        @for (ob of obligations(); track ob.obligation_id || ob.obligation_name; let i = $index) {
                           <tr>
                              <td class="center">{{ i + 1 }}</td>
                              <td>{{ ob.obligation_name }}</td>
                              <td class="center">{{ ob.effective_from | date:'dd/MM/yyyy' }}</td>
                              <td class="center">{{ ob.effective_to ? (ob.effective_to | date:'dd/MM/yyyy') : 'N.A.' }}</td>
                              <td class="center">{{ ob.status | titlecase }}</td>
                           </tr>
                        }
                     </tbody>
                  </table>
               } @else {
                  <table class="cert-table list-table">
                     <thead><tr><th>Sr. No.</th><th>Tax Obligation(s)</th><th>Effective From Date</th><th>Effective Till Date</th><th>Status</th></tr></thead>
                     <tbody>
                        <tr><td class="center">1</td><td>Income Tax - Resident Individual</td><td class="center">{{ registrationDate() | date:'dd/MM/yyyy' }}</td><td class="center">N.A.</td><td class="center">Active</td></tr>
                     </tbody>
                  </table>
               }
            </div>

            <!-- Section: Electronic Tax Invoicing Status -->
            <div class="cert-section">
               <h3 class="section-title">Electronic Tax Invoicing Status</h3>
               <table class="cert-table grid-table">
                  <tr>
                     <th width="20%">eTims Registration:</th>
                     <td width="30%">Inactive</td>
                     <th width="20%">Tims Registration:</th>
                     <td width="30%">Inactive</td>
                  </tr>
               </table>
            </div>

            <div class="cert-disclaimer">
               <p>The above PIN must appear on all your tax invoices and correspondences with Kenya Revenue Authority. Your accounting end date is 31st December as per the provisions stated in the Income Tax Act unless a change has been approved by the Commissioner-Domestic Taxes Department. The status of Tax Obligation(s) with 'Dormant' status will automatically change to 'Active' on date mentioned in "Effective Till Date" or any transaction done during the period. This certificate shall remain in force till further updated.</p>
            </div>

            <div class="cert-footer-branded">
               <div class="tagline">Tulipe Ushuru, Tujitegemee!</div>
               <div class="branding-logos">
                  <img ngSrc="assets/itax.jpeg" width="100" height="36" alt="iTax" class="footer-brand-img">
                  <img ngSrc="assets/vision_2030.png" width="100" height="36" alt="Vision 2030" class="footer-brand-img">
               </div>
               <div class="disclaimer-note">
                  Disclaimer: This is a system generated certificate and does not require signature.
               </div>
            </div>
          </div>
        </div>

        <!-- Theme Adherence Disclaimer -->
        <footer class="db-footer-elite no-print">
           <p>STATUTORY IDENTIFICATION ARCHIVE. AUTHORIZED ACCESS ONLY. THIS RECORD IS SYNCHRONIZED WITH THE CENTRAL TAXPAYER REGISTRY.</p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --red:          #D92B2B;
      --red-bright:   #EF3B3B;
      --red-glow:     rgba(217, 43, 43, 0.38);
      --red-pale:     rgba(217, 43, 43, 0.10);
      --red-border:   rgba(217, 43, 43, 0.22);

      --bg-root:      #0C0C0C;
      --bg-card:      #141414;
      --bg-card-2:    #1C1C1C;
      
      --text-pri:     #F0F0F0;
      --text-sec:     #888888;
      --text-mut:     #4A4A4A;

      --bdr:          rgba(255, 255, 255, 0.08);
      --bdr-md:       rgba(255, 255, 255, 0.14);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    @media (prefers-color-scheme: light) {
      :host {
        --bg-root:    #F2F2F4;
        --bg-card:    #FFFFFF;
        --bg-card-2:  #F8F8FA;
        --text-pri:   #111111;
        --text-sec:   #555560;
        --text-mut:   #9999A8;
        --bdr:        rgba(0, 0, 0, 0.08);
      }
    }

    .db-root { min-height: 100vh; background: var(--bg-root); color: var(--text-pri); position: relative; overflow-x: hidden; }
    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.03; z-index: 1; pointer-events: none; }
    .accent-bleed { position: fixed; top: -10vw; left: -10vw; width: 40vw; height: 40vw; background: var(--red); filter: blur(15vw); opacity: 0.08; border-radius: 50%; z-index: 1; pointer-events: none; }

    .db-inner { max-width: 1440px; margin: 0 auto; padding: 40px 28px 80px; display: flex; flex-direction: column; gap: 48px; position: relative; z-index: 10; }

    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
    .premium-title { font-size: clamp(32px, 5vw, 48px); font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--red); }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); }

    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--red-pale); border: 1px solid var(--red-border); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 1.5s infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .flex-btns { display: flex; gap: 12px; }

    .btn-primary-elite {
      background: var(--red); color: white; border: none;
      padding: 14px 24px; border-radius: 12px; font-size: 11px; font-weight: 800;
      letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s;
      box-shadow: 0 4px 14px var(--red-glow);
    }
    .btn-primary-elite:hover { background: var(--red-bright); transform: translateY(-1px); }

    .btn-ghost-elite {
      background: var(--bg-card-2); color: var(--text-sec); border: 1px solid var(--bdr);
      padding: 14px 24px; border-radius: 12px; font-size: 11px; font-weight: 800;
      letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; gap: 10px;
    }
    .btn-ghost-elite:hover { background: var(--bdr); color: var(--text-pri); }

    /* ── OFFICIAL CERT PAPER ────────────────────────── */
    .official-cert-paper {
      background: #ffffff;
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      box-shadow: 0 40px 100px rgba(0,0,0,0.5);
      border: 1px solid #e5e7eb;
      color: #000000;
      font-family: 'Arial', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .cert-content-inner { padding: 35px 35px 35px 60px; position: relative; z-index: 5; }

    #branding-bar { position: absolute; top: 0; left: 0; width: 38px; height: 100%; z-index: 10; overflow: hidden; display: flex; flex-direction: column; }
    .wedge-top, .wedge-bottom { display: block; width: 38px; flex: 1; }

    .cert-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; border-bottom: 2pt solid #000; padding-bottom: 10px; }
    .kra-logo-large { height: 75px; object-fit: contain; margin-bottom: 5px; }
    .kra-url { font-size: 11pt; font-weight: bold; border-bottom: 2pt solid #000; padding-bottom: 1px; }
    .cert-title-bg { background: #F2F2F4; padding: 12px 50px; font-size: 18pt; font-weight: bold; text-align: center; border-radius: 2px; }
    .cert-contact-info { text-align: right; }
    .contact-header { font-size: 9pt; font-weight: bold; line-height: 1.2; }
    .contact-line { font-size: 9pt; margin-top: 1px; }

    .cert-meta { display: flex; flex-direction: column; align-items: flex-end; margin: 15px 0; border-bottom: 2pt solid #000; padding-bottom: 15px; }
    .meta-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
    .meta-label { font-size: 11pt; font-weight: bold; }
    .meta-value { font-size: 11pt; }
    .pin-highlight { font-size: 13pt; font-weight: bold; letter-spacing: 0.5px; }
    .cert-certify { text-align: center; font-size: 11pt; margin: 20px 0 28px 0; }

    .cert-section { margin-bottom: 20px; }
    .section-title { font-size: 13pt; font-weight: bold; text-align: center; margin-bottom: 10px; }
    .cert-table { width: 100%; border-collapse: collapse; border: 1.2pt solid #000; }
    .cert-table th, .cert-table td { border: 1.2pt solid #000; padding: 7px 10px; font-size: 10pt; }
    .cert-table th { background: #fff; text-align: left; font-weight: bold; }
    .list-table thead th { background: #F2F2F4; text-align: center; font-weight: bold; }
    .cert-disclaimer { font-size: 8.5pt; line-height: 1.5; margin: 20px 0; text-align: justify; }

    .cert-footer-branded {
        margin-top: 15px; border-top: 1pt solid #000; padding-top: 12px;
        display: flex; flex-direction: column; align-items: center; gap: 12px;
    }
    .tagline { font-size: 11pt; font-weight: bold; font-style: italic; color: #D92B2B; }
    .branding-logos { display: flex; justify-content: space-between; width: 100%; align-items: center; padding: 0 10px; }
    .footer-brand-img { height: 36px; object-fit: contain; }
    .disclaimer-note { font-size: 7.5pt; color: #666; font-style: italic; width: 100%; text-align: left; }

    .db-footer-elite { margin-top: 40px; padding: 40px; border: 1px solid var(--bdr); border-radius: 32px; text-align: center; background: var(--bg-card-2); }
    .db-footer-elite p { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 4px; line-height: 1.8; max-width: 800px; margin: 0 auto; }

    @media print {
      .no-print { display: none !important; }
      @page { margin: 0; size: A4; }
      body { background: white !important; }
      .official-cert-paper { margin: 0 !important; box-shadow: none !important; border: none !important; width: 210mm !important; height: 297mm !important; }
    }

    @media (max-width: 900px) {
      .official-cert-paper { width: 100%; height: auto; padding: 0; }
      .cert-content-inner { padding: 20px 20px 20px 45px; }
      #branding-bar { width: 10mm; min-height: 100%; }
    }

    /* Animations */
    .animate-stagger > * { opacity: 0; animation: slideIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PinCertificateComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardData = inject(DashboardDataService);

  readonly today = new Date();
  
  pin = input<string>();
  name = input<string>();
  email = input<string>();
  
  userName = computed(() => this.name() || this.authService.userName() || 'Taxpayer');
  userEmail = computed(() => this.email() || this.authService.currentUser()?.email || 'N.A.');
  taxpayerPin = computed(() => this.pin() || this.authService.currentUser()?.taxpayer_id || 'N/A');

  registrationDate = computed(() => {
    const u = this.authService.currentUser() as any;
    return u?.registration_date ?? u?.registrationDate ?? this.today;
  });

  taxpayerType = computed(() => {
    const type = this.authService.currentUser()?.type;
    return type === 'business' ? 'Non-Individual (Business)' : 'Individual';
  });

  profile = this.dashboardData.taxpayerProfile;
  station = this.dashboardData.station;
  obligations = this.dashboardData.obligations;

  ngOnInit() {
    if (!this.dashboardData.taxpayerProfile()) {
      this.dashboardData.refreshData().subscribe();
    }
  }

  downloadPdf() {
    this.authService.isLoading.set(true);
    this.authService.refreshToken().subscribe({
      next: (res) => {
        this.authService.isLoading.set(false);
        const token = this.authService.getAuthToken();
        const url = `${environment.apiUrl}/pin_certificate_pdf.php?token=${encodeURIComponent(token ?? '')}`;
        window.open(url, '_blank');
      },
      error: () => {
        this.authService.isLoading.set(false);
        const token = this.authService.getAuthToken();
        const url = `${environment.apiUrl}/pin_certificate_pdf.php?token=${encodeURIComponent(token ?? '')}`;
        window.open(url, '_blank');
      }
    });
  }

  print() {
    window.print();
  }
}
