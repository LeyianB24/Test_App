import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardDataService } from '../../../../services/dashboard-data.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-pin-certificate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-up print-container">
      <!-- ── Dashboard Header (Hidden on Print) ─────────────── -->
      <header class="page-header-elite no-print">
        <div class="header-info">
          <h1 class="premium-title">PIN <span class="gradient-text">Registration Certificate</span></h1>
          <p class="premium-subtitle">Official acknowledgement of taxpayer registration with KRA.</p>
        </div>
        <div class="header-actions">
           <button class="modern-btn primary-btn" (click)="downloadPdf()">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Download PDF Certificate
           </button>
        </div>
      </header>

      <!-- ── Official PIN Certificate Document ──────────────── -->
      <div id="pin-cert-doc" class="official-cert-paper">

        <!-- Hourglass Branding Bar (Left) -->
        <div id="branding-bar">
          <div class="triangle-top"></div>
          <div class="triangle-bottom"></div>
        </div>

        <div class="cert-content-inner">
          <!-- Document Header -->
          <div class="cert-header">
             <div class="cert-header-left">
                <img src="assets/logo.png" class="kra-logo-large" alt="KRA Logo">
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
                <img src="assets/itax.jpeg" alt="iTax" class="footer-brand-img">
                <img src="assets/vision_2030.png" alt="Vision 2030" class="footer-brand-img">
             </div>
             <div class="disclaimer-note">
                Disclaimer: This is a system generated certificate and does not require signature.
             </div>
          </div>
        </div><!-- /cert-content-inner -->

      </div><!-- /official-cert-paper -->
    </div>
  `,
  styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; padding-bottom: 50px; }

    .official-cert-paper {
      background: #ffffff;
      width: 210mm;
      min-height: 297mm;
      margin: 20px auto;
      padding: 0;
      box-shadow: 0 5px 30px rgba(0,0,0,0.1);
      border: 1px solid #ddd;
      color: #000000;
      font-family: 'Arial', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .cert-content-inner {
      padding: 35px 35px 35px 60px;
      position: relative;
      z-index: 5;
    }

    /* ── Hourglass Branding Bar ── */
    #branding-bar {
        position: absolute;
        top: 0;
        left: 0;
        width: 15mm;
        height: 100%;
        min-height: 297mm;
        z-index: 10;
        overflow: hidden;
    }
    /* Top black triangle — fills top half */
    .triangle-top {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        border-style: solid;
        /* right edge is the hypotenuse going from full-width (15mm) → 0 */
        border-width: 148.5mm 15mm 0 0;
        border-color: #000000 transparent transparent transparent;
    }
    /* Bottom red triangle — fills bottom half, inverted */
    .triangle-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 0 148.5mm 15mm;
        border-color: transparent transparent #cc0000 transparent;
    }

    /* Certificate Header */
    .cert-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; border-bottom: 2pt solid #000; padding-bottom: 10px; }
    .cert-header-left { display: flex; flex-direction: column; align-items: flex-start; }
    .kra-logo-large { height: 75px; object-fit: contain; margin-bottom: 5px; }
    .kra-url { font-size: 11pt; font-weight: bold; border-bottom: 2pt solid #000; padding-bottom: 1px; }
    .cert-title-box { flex: 1; display: flex; justify-content: center; margin-top: 15px; }
    .cert-title-bg { background: #E5E7EB; padding: 12px 50px; font-size: 18pt; font-weight: bold; text-align: center; border-radius: 2px; }
    .cert-contact-info { text-align: right; }
    .contact-header { font-size: 9pt; font-weight: bold; line-height: 1.2; }
    .contact-line { font-size: 9pt; margin-top: 1px; }

    /* Meta */
    .cert-meta { display: flex; flex-direction: column; align-items: flex-end; margin: 15px 0; border-bottom: 2pt solid #000; padding-bottom: 15px; }
    .meta-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
    .meta-label { font-size: 11pt; font-weight: bold; }
    .meta-value { font-size: 11pt; }
    .pin-highlight { font-size: 13pt; font-weight: bold; letter-spacing: 0.5px; }
    .cert-certify { text-align: center; font-size: 11pt; color: #000; margin: 20px 0 28px 0; }

    /* Sections & Tables */
    .cert-section { margin-bottom: 20px; }
    .section-title { font-size: 13pt; font-weight: bold; text-align: center; margin-bottom: 10px; }
    .cert-table { width: 100%; border-collapse: collapse; border: 1.2pt solid #000; }
    .cert-table th, .cert-table td { border: 1.2pt solid #000; padding: 7px 10px; font-size: 10pt; }
    .cert-table th { background: #fff; text-align: left; font-weight: bold; }
    .cert-table td { background: #fff; }
    .cert-table td.center { text-align: center; }
    .list-table thead th { background: #E5E7EB; text-align: center; font-weight: bold; }
    .cert-disclaimer { font-size: 8.5pt; line-height: 1.5; margin: 20px 0; text-align: justify; }

    /* Branded Footer */
    .cert-footer-branded {
        margin-top: 15px; border-top: 1pt solid #000; padding-top: 12px;
        display: flex; flex-direction: column; align-items: center; gap: 12px;
    }
    .tagline { font-size: 11pt; font-weight: bold; font-style: italic; color: #cc0000; }
    .branding-logos { display: flex; justify-content: space-between; width: 100%; align-items: center; padding: 0 10px; }
    .footer-brand-img { height: 36px; object-fit: contain; }
    .disclaimer-note { font-size: 7.5pt; color: #666; font-style: italic; width: 100%; text-align: left; }

    /* Print */
    @media print {
      .no-print { display: none !important; }
      @page { margin: 0; size: A4; }
      body { background: white !important; padding: 0 !important; margin: 0 !important; }
      .page-container { max-width: none !important; padding: 0 !important; margin: 0 !important; }
      .official-cert-paper {
        margin: 0 !important; box-shadow: none !important; border: none !important;
        width: 210mm !important; height: 297mm !important; position: relative !important;
      }
      #branding-bar { height: 297mm !important; min-height: 297mm !important; }
      .triangle-top { border-width: 148.5mm 15mm 0 0 !important; }
      .triangle-bottom { border-width: 0 0 148.5mm 15mm !important; }
    }

    @media (max-width: 800px) {
      .official-cert-paper { width: auto; height: auto; padding: 0; }
      .cert-content-inner { padding: 20px 20px 20px 45px; }
      #branding-bar { width: 10mm; min-height: 100%; }
      .triangle-top { border-width: 148.5mm 10mm 0 0; }
      .triangle-bottom { border-width: 0 0 148.5mm 10mm; }
    }
  `]
})
export class PinCertificateComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardData = inject(DashboardDataService);

  readonly today = new Date();
  
  // Optional inputs for use in registration success or other flows
  pin = input<string>();
  name = input<string>();
  email = input<string>();
  
  // Auth signals with input fallbacks
  userName = computed(() => this.name() || this.authService.userName());
  userEmail = computed(() => this.email() || this.authService.currentUser()?.email || 'N.A.');
  taxpayerPin = computed(() => this.pin() || this.authService.currentUser()?.taxpayer_id || 'N/A');

  // The backend returns `registration_date` (snake_case); the User model has `registrationDate`.
  // Using `as any` to handle both shapes safely at runtime.
  registrationDate = computed(() => {
    const u = this.authService.currentUser() as any;
    return u?.registration_date ?? u?.registrationDate ?? this.today;
  });

  taxpayerType = computed(() => {
    const type = this.authService.currentUser()?.type;
    if (!type) return 'Individual';
    return type === 'business' ? 'Non-Individual (Business)' : 'Individual';
  });

  // Dashboard data signals
  profile = this.dashboardData.taxpayerProfile;
  station = this.dashboardData.station;
  obligations = this.dashboardData.obligations;

  ngOnInit() {
    // Refresh data if not already loaded
    if (!this.dashboardData.taxpayerProfile()) {
      this.dashboardData.refreshData().subscribe();
    }
  }

  downloadPdf() {
    this.authService.isLoading.set(true);
    // Force a fresh token before download to prevent "Invalid or expired token" errors
    // Since access tokens expire in 15 mins but user might stay on dashboard longer.
    this.authService.refreshToken().subscribe({
      next: (res) => {
        this.authService.isLoading.set(false);
        const token = this.authService.getAuthToken();
        const url = `${environment.apiUrl}/pin_certificate_pdf.php?token=${encodeURIComponent(token ?? '')}`;
        window.open(url, '_blank');
      },
      error: () => {
        this.authService.isLoading.set(false);
        // Fallback: try download anyway if refresh fails
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
