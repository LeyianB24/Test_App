import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-pin-certificate',
  standalone: true,
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
           <button class="modern-btn primary-btn" (click)="print()">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Print Certificate
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
                <span class="meta-value">{{ pinData.regDate | date:'dd/MM/yyyy' }}</span>
             </div>
             <div class="meta-row">
                <span class="meta-label">Personal Identification Number</span>
                <div class="meta-value pin-highlight">{{ pin() }}</div>
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
                   <td class="text-uppercase">{{ userEmail() }}</td>
                </tr>
             </table>
          </div>

          <!-- Section: Registered Address -->
          <div class="cert-section">
             <h3 class="section-title">Registered Address</h3>
             <table class="cert-table grid-table">
                <tr>
                   <th width="20%">L.R. Number :</th>
                   <td width="30%">{{ pinData.lrNumber || 'N.A.' }}</td>
                   <th width="20%">Building :</th>
                   <td width="30%">{{ pinData.building || 'N.A.' }}</td>
                </tr>
                <tr>
                   <th>Street/Road :</th>
                   <td>{{ pinData.street || 'N.A.' }}</td>
                   <th>City/Town :</th>
                   <td>{{ pinData.town || 'N.A.' }}</td>
                </tr>
                <tr>
                   <th>County :</th>
                   <td>{{ pinData.county || 'N.A.' }}</td>
                   <th>District :</th>
                   <td>{{ pinData.district || 'N.A.' }}</td>
                </tr>
                <tr>
                   <th>Tax Area :</th>
                   <td>{{ pinData.taxArea || 'N.A.' }}</td>
                   <th>Station :</th>
                   <td>{{ pinData.station || 'N.A.' }}</td>
                </tr>
                <tr>
                   <th>P. O. Box :</th>
                   <td>{{ pinData.poBox || 'N.A.' }}</td>
                   <th>Postal Code :</th>
                   <td>{{ pinData.postalCode || 'N.A.' }}</td>
                </tr>
             </table>
          </div>

          <!-- Section: Tax Obligation(s) Registration Details -->
          <div class="cert-section">
             <h3 class="section-title">Tax Obligation(s) Registration Details</h3>
             <table class="cert-table list-table">
                <thead class="bg-gray-light">
                   <tr>
                      <th width="8%">Sr. No.</th>
                      <th width="35%">Tax Obligation(s)</th>
                      <th width="19%">Effective From Date</th>
                      <th width="19%">Effective Till Date</th>
                      <th width="19%">Status</th>
                   </tr>
                </thead>
                <tbody>
                   @for (ob of pinData.obligations; track ob.name; let i = $index) {
                      <tr>
                         <td align="center">{{ i + 1 }}</td>
                         <td>{{ ob.name }}</td>
                         <td align="center">{{ ob.effectiveFrom | date:'dd/MM/yyyy' }}</td>
                         <td align="center">{{ ob.effectiveTill || 'N.A.' }}</td>
                         <td align="center">{{ ob.status }}</td>
                      </tr>
                   }
                </tbody>
             </table>
          </div>

          <!-- Section: Electronic Tax Invoicing Status -->
          <div class="cert-section">
             <h3 class="section-title">Electronic Tax Invoicing Status</h3>
             <table class="cert-table grid-table">
                <tr>
                   <th width="20%">eTims Registration:</th>
                   <td width="30%">{{ pinData.eTims || 'Inactive' }}</td>
                   <th width="20%">Tims Registration:</th>
                   <td width="30%">{{ pinData.tims || 'Inactive' }}</td>
                </tr>
             </table>
          </div>

          <div class="cert-disclaimer">
             <p>The above PIN must appear on all your tax invoices and correspondences with Kenya Revenue Authority. Your accounting end date is 31st December as per the provisions stated in the Income Tax Act unless a change has been approved by the Commissioner-Domestic Taxes Department. The status of Tax Obligation(s) with 'Dormant' status will automatically change to 'Active' on date mentioned in "Effective Till Date" or any transaction done during the period. This certificate shall remain in force till further updated.</p>
          </div>

          <div class="cert-footer-branded">
             <div class="tagline">Tulipe Ushuru, Tujitegemee!</div>
             <div class="branding-logos">
                <div class="branding-item">
                   <span class="logo-text itax">iTax</span>
                </div>
                <div class="branding-item">
                   <div class="v2030-box">
                      <span class="v-text">KENYA</span>
                      <span class="v-num">VISION 2030</span>
                   </div>
                </div>
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
      padding: 35px 35px 35px 65px; /* Offset for branding bar */
      position: relative;
      z-index: 5;
    }

    /* Hourglass Branding Bar */
    #branding-bar {
        position: absolute;
        top: 0;
        left: 0;
        width: 15mm;
        height: 100%;
        z-index: 10;
        background: #fff;
    }
    .triangle-top {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 130mm 15mm 0 0;
        border-color: #000 transparent transparent transparent;
    }
    .triangle-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 15mm 167mm 0;
        border-color: transparent transparent #cc0000 transparent;
    }

    /* Certificate Header Styles */
    .cert-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; border-bottom: 2pt solid #000; padding-bottom: 10px; }
    .cert-header-left { display: flex; flex-direction: column; align-items: flex-start; }
    .kra-logo-large { height: 75px; object-fit: contain; margin-bottom: 5px; }
    .kra-url { font-size: 11pt; font-weight: bold; border-bottom: 2pt solid #000; padding-bottom: 1px; }

    .cert-title-box { flex: 1; display: flex; justify-content: center; margin-top: 15px; }
    .cert-title-bg { background: #E5E7EB; padding: 12px 50px; font-size: 18pt; font-weight: bold; text-align: center; border-radius: 2px; }

    .cert-contact-info { text-align: right; }
    .contact-header { font-size: 9pt; font-weight: bold; line-height: 1.2; }
    .contact-line { font-size: 9pt; margin-top: 1px; }

    /* Meta Info Styles */
    .cert-meta { display: flex; flex-direction: column; align-items: flex-end; margin: 15px 0; border-bottom: 2pt solid #000; padding-bottom: 15px; }
    .meta-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
    .meta-label { font-size: 11pt; font-weight: bold; }
    .meta-value { font-size: 11pt; }
    .pin-highlight { font-size: 13pt; font-weight: bold; letter-spacing: 0.5px; }

    .cert-certify { text-align: center; font-size: 11pt; color: #000; margin: 25px 0 35px 0; }

    /* Section & Table Styles */
    .cert-section { margin-bottom: 25px; }
    .section-title { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 12px; }
    
    .cert-table { width: 100%; border-collapse: collapse; border: 1.2pt solid #000; }
    .cert-table th, .cert-table td { border: 1.2pt solid #000; padding: 8px 12px; font-size: 11pt; }
    .cert-table th { background: #fff; text-align: left; font-weight: bold; }
    .cert-table td { background: #fff; }

    .bg-gray-light { background: #E5E7EB !important; }
    .list-table thead th { background: #E5E7EB; text-align: center; border-bottom: 1.2pt solid #000; }

    .cert-disclaimer { font-size: 9pt; line-height: 1.5; margin: 30px 0; text-align: justify; }

    /* Branded Footer */
    .cert-footer-branded { 
        margin-top: 20px;
        border-top: 1pt solid #000; 
        padding-top: 15px; 
        display: flex; 
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }
    .tagline { font-size: 12pt; font-weight: bold; font-style: italic; color: #cc0000; }
    
    .branding-logos { display: flex; justify-content: space-between; width: 100%; align-items: center; padding: 0 10px; }
    .logo-text.itax { font-size: 24pt; font-weight: 900; color: #cc0000; font-family: sans-serif; }
    
    .v2030-box { display: flex; flex-direction: column; align-items: center; }
    .v-text { font-size: 8pt; font-weight: bold; letter-spacing: 2px; }
    .v-num { font-size: 14pt; font-weight: 900; color: #000; }

    .disclaimer-note { font-size: 8pt; color: #666; font-style: italic; width: 100%; text-align: left; }

    /* Print Overrides */
    @media print {
      .no-print { display: none !important; }
      @page { margin: 0; size: A4; }
      body { background: white !important; padding: 0 !important; margin: 0 !important; }
      .page-container { max-width: none !important; padding: 0 !important; margin: 0 !important; }
      .official-cert-paper { 
        margin: 0 !important; 
        box-shadow: none !important; 
        border: none !important; 
        width: 210mm !important;
        height: 297mm !important;
        position: relative !important;
      }
      #branding-bar { height: 297mm !important; }
    }

    @media (max-width: 800px) {
      .official-cert-paper { width: auto; height: auto; padding: 0; }
      .cert-content-inner { padding: 20px 20px 20px 45px; }
      #branding-bar { width: 10mm; }
      .triangle-top { border-width: 80mm 10mm 0 0; }
      .triangle-bottom { border-width: 0 10mm 100mm 0; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinCertificateComponent implements OnInit {
  private authService = inject(AuthService);

  pin = input<string>('A014256803M');
  userName = this.authService.userName;
  userEmail = computed(() => this.authService.currentUser()?.email || 'N.A.');
  
  pinData = {
    lrNumber: 'N.A.',
    building: 'DAIMA',
    street: 'NAMANGA ROAD',
    city: 'ILBISSIL',
    town: 'ILBISSIL',
    county: 'Kajiado',
    district: 'Kajiado Central District',
    taxArea: 'Ilbisil',
    station: 'Machakos',
    poBox: '80',
    postalCode: '01101',
    regDate: '2019-10-01',
    eTims: 'Inactive',
    tims: 'Inactive',
    obligations: [
       { name: 'Income Tax - Resident Individual', effectiveFrom: '2019-10-01', effectiveTill: 'N.A.', status: 'Active' }
    ]
  };

  ngOnInit() {
    // If we have a user in session, we could fetch their actual registration details here.
    // For now we use the sample data from the instruction image.
  }

  print() {
    window.print();
  }
}
