import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  imports: [NgOptimizedImage],
  template: `
    <footer class="main-footer">
      <div class="footer-branding-top">
        <div class="f-top-logo-box">
          <img ngSrc="assets/itax.jpeg" width="180" height="70" alt="iTax" class="f-logo-top">
        </div>
      </div>

      <div class="footer-content">

        <div class="footer-col brand-col">
          <h4>Kenya Revenue Authority</h4>
          <p class="slogan"><em>"Tulipe Ushuru, Tujitegemee!"</em></p>
          <p class="mission">Building Trust through Facilitation so as to foster Compliance.</p>

          <div class="social-icons">
            <a href="#" class="social-link" title="Facebook">
              <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="social-link" title="Twitter / X">
               <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" class="social-link" title="YouTube">
               <svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Related Links</h4>
          <ul class="footer-links">
            <li><a href="https://kentrade.go.ke" target="_blank">KenTrade Portal</a></li>
            <li><a href="https://ecitizen.go.ke" target="_blank">eCitizen</a></li>
            <li><a href="https://treasury.go.ke" target="_blank">Ministry of Finance</a></li>
            <li><a href="https://centralbank.go.ke" target="_blank">Central Bank (CBK)</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Contact Support</h4>
          <ul class="footer-links contact-list">
            <li><span>📞</span> 020 4 999 999</li>
            <li><span>📱</span> 0711 099 999</li>
            <li><span>✉️</span> callcentre@kra.go.ke</li>
            <li><a href="https://www.kra.go.ke/iwhistle/" target="_blank" class="fraud-link">Report Tax Fraud</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Legal</h4>
          <ul class="footer-links">
            <li><a href="https://www.kra.go.ke/en/privacy-policy" target="_blank">Privacy Policy</a></li>
            <li><a href="https://www.kra.go.ke/en/terms-conditions" target="_blank">Terms & Conditions</a></li>
            <li><a href="https://www.kra.go.ke/en/data-protection" target="_blank">Data Protection</a></li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom">
        <div class="footer-baseline">
          <p>&copy; {{ currentYear }} Kenya Revenue Authority. All Rights Reserved.</p>
          <div class="f-bottom-logo-box">
             <img ngSrc="assets/vision_2030.png" width="150" height="60" alt="Vision 2030" class="f-logo-bottom">
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
