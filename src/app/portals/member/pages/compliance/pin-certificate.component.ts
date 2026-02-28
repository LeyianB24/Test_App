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

        <div class="cert-footer">
           <div class="disclaimer-note">
              Disclaimer: This is a system generated certificate and does not require signature.
           </div>
           <div class="verification-area">
              <div class="verification-qr">
                 <!-- Simple SVG QR Mockup -->
                 <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3-6h1.5v1.5H18V13zm3 0h1.5v1.5H21V13z" />
                 </svg>
              </div>
              <div class="verification-info">
                 <div class="v-label">Verification Code:</div>
                 <div class="v-code">{{ pin().substring(0,3) }}-{{ pin().substring(3,6) }}-{{ pin().substring(6,9) }}</div>
              </div>
           </div>
        </div>

      </div><!-- /official-cert-paper -->
    </div>
  `,
  styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; padding-bottom: 50px; }
    
    .official-cert-paper {
      background: #ffffff;
      width: 210mm; /* A4 Width */
      min-height: 297mm; /* A4 Height */
      margin: 20px auto;
      padding: 40px;
      box-shadow: 0 5px 30px rgba(0,0,0,0.1);
      border: 1px solid #ddd;
      color: #000000;
      font-family: 'Arial', sans-serif;
      position: relative;
    }

    /* Certificate Header Styles */
    .cert-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px; }
    .cert-header-left { display: flex; flex-direction: column; align-items: flex-start; }
    .kra-logo-large { height: 80px; object-contain; margin-bottom: 10px; }
    .kra-url { font-size: 14px; font-weight: bold; border-bottom: 3px solid #000; padding-bottom: 2px; }

    .cert-title-box { flex: 1; display: flex; justify-content: center; margin-top: 20px; }
    .cert-title-bg { background: #cccccc; padding: 15px 60px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 2px; }

    .cert-contact-info { text-align: right; }
    .contact-header { font-size: 11px; font-weight: bold; line-height: 1.2; }
    .contact-line { font-size: 11px; margin-top: 2px; }

    /* Meta Info Styles */
    .cert-meta { display: flex; flex-direction: column; align-items: flex-end; margin: 20px 0; border-bottom: 2px solid #000; padding-bottom: 20px; }
    .meta-row { display: flex; align-items: center; gap: 15px; margin-bottom: 5px; }
    .meta-label { font-size: 13px; font-weight: bold; }
    .meta-value { font-size: 13px; }
    .pin-highlight { font-size: 16px; font-weight: bold; letter-spacing: 1px; }

    .cert-certify { text-align: center; font-size: 14px; color: #333; margin: 30px 0 40px 0; }

    /* Section & Table Styles */
    .cert-section { margin-bottom: 30px; }
    .section-title { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 15px; }
    
    .cert-table { width: 100%; border-collapse: collapse; border: 1.5px solid #000; }
    .cert-table th, .cert-table td { border: 1.5px solid #000; padding: 10px 15px; font-size: 13px; }
    .cert-table th { background: #ffffff; text-align: left; font-weight: bold; }
    .cert-table td { background: #ffffff; }

    .grid-table th { width: 20%; background: #ffffff; }
    .grid-table td { width: 30%; }

    .bg-gray-light { background: #cccccc !important; }
    .list-table thead th { background: #cccccc; text-align: center; border-bottom: 2px solid #000; }
    .list-table tbody td { height: 35px; }

    .text-uppercase { text-transform: uppercase; }

    .cert-disclaimer { font-size: 11px; line-height: 1.6; margin: 40px 0; text-align: justify; }

    /* Footer Styles */
    .cert-footer { border-top: 1px solid #000; padding-top: 15px; display: flex; justify-content: space-between; align-items: flex-end; }
    .disclaimer-note { font-size: 10px; color: #555; }
    
    .verification-area { display: flex; align-items: center; gap: 15px; }
    .verification-qr { padding: 5px; border: 1px solid #ccc; background: white; }
    .verification-info { display: flex; flex-direction: column; }
    .v-label { font-size: 10px; font-weight: bold; color: #555; }
    .v-code { font-family: monospace; font-size: 12px; font-weight: bold; color: #3b82f6; }

    /* Print Overrides */
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; padding: 0 !important; margin: 0 !important; }
      .page-container { max-width: none !important; padding: 0 !important; margin: 0 !important; }
      .official-cert-paper { 
        margin: 0 !important; 
        box-shadow: none !important; 
        border: none !important; 
        width: 100% !important;
        position: static !important;
      }
      .dashboard-container { display: block !important; } /* Ensure it shows even in layouts that might hide main */
    }

    @media (max-width: 800px) {
      .official-cert-paper { width: auto; height: auto; padding: 20px; overflow-x: auto; }
      .cert-title-bg { padding: 10px 20px; font-size: 18px; }
      .cert-header { flex-direction: column; align-items: center; text-align: center; }
      .kra-logo-large { height: 60px; }
      .cert-contact-info { text-align: center; margin-top: 15px; }
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
