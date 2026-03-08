import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-footer',
  imports: [],
  template: `
    <footer class="main-footer admin-footer">
      <div class="footer-content">

        <div class="footer-col brand-col">
          <h4>KRA Internal Systems</h4>
          <p class="slogan"><em>"Modernizing Revenue Administration"</em></p>
          <p class="mission">Administrative Console — Authorized Personnel Only.</p>
        </div>

        <div class="footer-col">
          <h4>Staff Resources</h4>
          <ul class="footer-links">
            <li><a href="#">Staff Intranet</a></li>
            <li><a href="#">HR Management</a></li>
            <li><a href="#">IT Service Desk</a></li>
            <li><a href="#">System Health Board</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Operational Support</h4>
          <ul class="footer-links contact-list">
            <li><span>📞</span> Ext: 4111 (Nairobi)</li>
            <li><span>📱</span> Internal Chat (AES-X)</li>
            <li><span>✉️</span> itsupport@kra.go.ke</li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Compliance & Security</h4>
          <ul class="footer-links">
            <li><a href="#">Security Guidelines</a></li>
            <li><a href="#">Data Handling Policy</a></li>
            <li><a href="#">Incident Reporting</a></li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom">
        <div class="footer-baseline">
          <p>&copy; {{ currentYear }} KRA Administrative Console. Secure Environment.</p>
          <div class="system-status">
             <span class="status-dot online"></span>
             <span class="status-label">API Gateway Online</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .admin-footer {
      border-top: 1.5px solid var(--red-500);
      background: var(--bg-footer);
      padding: 60px 0 20px 0;
    }
    .footer-content {
      max-width: 1600px; margin: 0 auto; padding: 0 40px;
      display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px;
      margin-bottom: 40px;
    }
    .footer-col h4 { color: var(--text-primary); font-size: 1rem; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid var(--red-500); display: inline-block; padding-bottom: 4px; }
    .slogan { color: var(--text-primary); font-weight: 700; margin-bottom: 8px; }
    .mission { color: var(--text-tertiary); font-size: 0.85rem; line-height: 1.6; }
    
    .footer-links { list-style: none; padding: 0; margin: 0; }
    .footer-links li { margin-bottom: 12px; }
    .footer-links a { color: var(--text-secondary); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: 0.3s; }
    .footer-links a:hover { color: var(--red-500); padding-left: 4px; }
    
    .contact-list li { display: flex; align-items: center; gap: 12px; color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; }
    
    .footer-bottom { border-top: 1px solid var(--border-subtle); padding: 20px 40px; }
    .footer-baseline { max-width: 1600px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .footer-baseline p { font-size: 0.8rem; color: var(--text-tertiary); font-weight: 700; }
    
    .system-status { display: flex; align-items: center; gap: 8px; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; }
    .status-dot.online { background: var(--status-success-text); box-shadow: 0 0 10px rgba(16,185,129,0.4); }
    .status-label { font-size: 0.7rem; font-weight: 800; color: var(--status-success-text); text-transform: uppercase; }

    @media (max-width: 991px) {
      .footer-content { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 480px) {
      .footer-content { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminFooterComponent {
  currentYear = new Date().getFullYear();
}
