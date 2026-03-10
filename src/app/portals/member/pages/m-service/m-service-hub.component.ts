import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-m-service-hub',
  standalone: true,
  imports: [RouterModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>
      
      <div class="db-inner max-w-lg">
        <header class="hub-header">
          <div class="hub-icon-wrap">
             <div class="icon-glow"></div>
             <svg class="hub-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 012 2z" /></svg>
          </div>
          
          <div class="header-content">
            <div class="header-tag">
              <span class="tag-glow"></span>
              <span class="tag-text">Mobile Gateway Protocol</span>
            </div>
            <h1 class="premium-title">M-Service <span class="red-gradient">Hub</span></h1>
            <p class="premium-subtitle">Professional Tax Administration at your fingertips</p>
          </div>
        </header>

        <!-- Quick Actions Grid -->
        <div class="actions-grid">
           @for (action of quickActions; track action.label) {
              <div class="elite-card action-card group" [routerLink]="action.link">
                 <div class="card-glow"></div>
                 <div class="action-icon-box">
                    <svg class="action-icon" [class]="action.colorClass" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" [attr.d]="action.icon" /></svg>
                 </div>
                 <span class="action-label">{{ action.label }}</span>
              </div>
           }
        </div>

        <!-- M-Pesa Quick Pay -->
        <section class="stk-section">
           <div class="stk-card group">
              <div class="stk-overlay"></div>
              <div class="stk-content">
                 <div class="stk-header">
                    <div class="mpesa-logo">M</div>
                    <div class="stk-title-wrap">
                       <h3 class="stk-title">M-PESA QUICK PAY</h3>
                       <p class="stk-sub">INSTANT LIABILITY LIQUIDATION</p>
                    </div>
                 </div>
                 
                 <p class="stk-desc">Input your PRN reference to initiate a secure biometric STK authentication protocol.</p>
                 
                 <div class="stk-form">
                    <div class="input-wrap">
                       <input type="text" placeholder="ENTER PRN NO." class="stk-input">
                       <div class="input-pulse"></div>
                    </div>
                    <button class="btn-stk">REQUEST GATEWAY AUTHENTICATION</button>
                 </div>
              </div>
              <div class="stk-bg-icon">
                 <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-.38-.07-.74-.17-1.11-.29l-.24 2.12-2.76-.32.48-4.22c-.67-.37-1.28-.84-1.81-1.39l-2.09 1.48-1.54-2.32 2.14-1.52c-.14-.54-.23-1.09-.27-1.65H2v-2.82h1.41c.04-.56.13-1.11.27-1.65l-2.14-1.52 1.54-2.32 2.09 1.48c.53-.55 1.14-1.02 1.81-1.39L8.48 2.21l2.76.32-.24 2.12c.37-.12.73-.22 1.11-.29V2h2.82v1.91c.38.07.74.17 1.11.29l.24-2.12 2.76.32-.48 4.22c.67.37 1.28.84 1.81 1.39l2.09-1.48 1.54 2.32-2.14 1.52c.14.54.23 1.09.27 1.65H22v2.82h-1.41c-.04.56-.13 1.11-.27 1.65l2.14 1.52-1.54 2.32-2.09-1.48c-.53.55-1.14 1.02-1.81 1.39l.48 4.22-2.76.32-.24-2.12c-.37.12-.73.22-1.11.29z" /></svg>
              </div>
           </div>
        </section>

        <!-- App Deployment Hub -->
        <section class="deploy-hub">
           <div class="elite-card deploy-card group">
              <div class="deploy-content">
                 <div class="deploy-text">
                    <h4 class="deploy-title">DEPLOYMENT HUB</h4>
                    <p class="deploy-sub">UNIFIED BINARY ARCHIVE</p>
                 </div>
                 <div class="qr-wrap">
                    <div class="qr-glow"></div>
                    <div class="qr-box">
                       <svg class="qr-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3-6h1.5v1.5H18V13zm3 0h1.5v1.5H21V13z" /></svg>
                    </div>
                 </div>
              </div>
              <div class="deploy-actions">
                 <button class="btn-deploy">ANDROID BINARY</button>
                 <button class="btn-deploy">IOS ARCHIVE</button>
              </div>
           </div>
        </section>
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
      background: var(--bg-root);
      position: relative;
      overflow-x: hidden;
      color: #fff;
    }

    .noise-overlay {
      position: fixed; inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3");
      opacity: 0.03;
      pointer-events: none;
      z-index: 1;
    }

    .accent-bleed {
      position: fixed; top: -10%; right: -5%;
      width: 60%; height: 50%;
      background: radial-gradient(circle at center, var(--red-pale) 0%, transparent 70%);
      filter: blur(80px);
      z-index: 0;
    }

    .db-inner {
      position: relative; z-index: 10;
      margin: 0 auto;
      padding: 64px 24px;
    }

    /* Header */
    .hub-header { text-align: center; margin-bottom: 56px; }
    .hub-icon-wrap {
       position: relative; width: 80px; height: 80px; margin: 0 auto 24px;
       display: flex; align-items: center; justify-content: center;
       background: linear-gradient(135deg, var(--red), var(--red-bright));
       border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);
       box-shadow: 0 16px 32px var(--red-glow);
       transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .hub-icon-wrap:hover { transform: scale(1.05) rotate(5deg); }
    .icon-glow { position: absolute; inset: -10px; background: var(--red); filter: blur(20px); opacity: 0.3; border-radius: inherit; }
    .hub-icon { width: 36px; height: 36px; color: #fff; position: relative; z-index: 1; }

    .header-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; background: rgba(255,255,255,0.05);
      border: 1px solid var(--bdr); border-radius: 100px;
      margin-bottom: 20px;
    }
    .tag-glow { width: 6px; height: 6px; background: var(--red); border-radius: 50%; box-shadow: 0 0 10px var(--red); }
    .tag-text { font-size: 10px; font-weight: 950; color: #fff; letter-spacing: 2.5px; text-transform: uppercase; }

    .premium-title { font-size: 36px; font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 0; }
    .red-gradient { background: linear-gradient(to right, #fff, var(--red-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .premium-subtitle { color: var(--text-muted); font-size: 14px; font-weight: 500; margin: 12px 0 0; letter-spacing: 0.5px; }

    /* Actions Grid */
    .actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 40px; }
    .action-card {
       padding: 32px; display: flex; flex-direction: column; align-items: center; text-align: center;
       background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 28px;
       cursor: pointer; transition: all 0.4s; position: relative; overflow: hidden;
    }
    .action-card:hover { transform: translateY(-4px); border-color: var(--red-border); background: var(--red-pale); }
    .card-glow { position: absolute; bottom: -40px; right: -40px; width: 120px; height: 120px; background: radial-gradient(circle, var(--red-pale) 0%, transparent 70%); opacity: 0; transition: opacity 0.4s; }
    .action-card:hover .card-glow { opacity: 1; }

    .action-icon-box {
       width: 56px; height: 56px; border-radius: 16px; background: #000;
       border: 1px solid var(--bdr); display: flex; align-items: center; justify-content: center;
       margin-bottom: 20px; transition: all 0.4s; position: relative; z-index: 1;
    }
    .action-card:hover .action-icon-box { transform: scale(1.1); border-color: rgba(255,255,255,0.2); }
    .action-icon { width: 28px; height: 28px; }
    .action-label { font-size: 11px; font-weight: 950; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; transition: color 0.4s; position: relative; z-index: 1; }
    .action-card:hover .action-label { color: #fff; }

    /* M-Pesa STK */
    .stk-section { margin-bottom: 40px; }
    .stk-card {
       padding: 40px; background: linear-gradient(135deg, #065f46, #064e3b);
       border-radius: 40px; position: relative; overflow: hidden;
       box-shadow: 0 20px 40px rgba(6, 78, 59, 0.4);
    }
    .stk-overlay { position: absolute; inset: 0; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.05), transparent); transform: translateX(-100%); transition: transform 0.8s; }
    .stk-card:hover .stk-overlay { transform: translateX(100%); }

    .stk-content { position: relative; z-index: 10; }
    .stk-header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
    .mpesa-logo { width: 56px; height: 56px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 950; color: #fff; }
    .stk-title { font-size: 20px; font-weight: 950; margin: 0; letter-spacing: -0.5px; }
    .stk-sub { font-size: 9px; font-weight: 950; color: rgba(255,255,255,0.6); margin: 4px 0 0; letter-spacing: 2px; }

    .stk-desc { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); margin: 0 0 32px; line-height: 1.6; text-transform: uppercase; letter-spacing: 0.5px; }

    .stk-form { display: flex; flex-direction: column; gap: 16px; }
    .input-wrap { position: relative; }
    .stk-input {
       width: 100%; height: 60px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
       border-radius: 20px; padding: 0 24px; color: #fff; font-size: 14px; font-weight: 900;
       letter-spacing: 2px; outline: none; transition: all 0.3s;
    }
    .stk-input::placeholder { color: rgba(255,255,255,0.3); }
    .stk-input:focus { background: rgba(255,255,255,0.15); border-color: #fff; }
    .input-pulse { position: absolute; right: 24px; top: 50%; translate: 0 -50%; width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }

    .btn-stk {
       height: 60px; background: #fff; color: #064e3b; border: none; border-radius: 20px;
       font-size: 11px; font-weight: 950; letter-spacing: 1.5px; cursor: pointer;
       transition: all 0.3s; box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }
    .btn-stk:hover { transform: translateY(-2px); background: #f0fdf4; box-shadow: 0 12px 24px rgba(0,0,0,0.3); }

    .stk-bg-icon { position: absolute; right: -40px; bottom: -40px; width: 240px; height: 240px; color: #fff; opacity: 0.03; transform: rotate(15deg); pointer-events: none; }

    /* Deploy Hub */
    .deploy-hub { margin-bottom: 24px; }
    .deploy-card { padding: 32px; background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 32px; backdrop-filter: blur(24px); }
    
    .deploy-content { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .deploy-title { font-size: 12px; font-weight: 950; margin: 0; letter-spacing: 2px; color: #fff; }
    .deploy-sub { font-size: 9px; font-weight: 950; color: var(--text-muted); margin: 6px 0 0; letter-spacing: 3px; }

    .qr-wrap { position: relative; }
    .qr-glow { position: absolute; inset: -10px; background: var(--red); opacity: 0.1; filter: blur(15px); border-radius: 12px; }
    .qr-box { width: 64px; height: 64px; background: #fff; border-radius: 16px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
    .qr-icon { width: 44px; height: 44px; color: #111; opacity: 0.2; }

    .deploy-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .btn-deploy {
       height: 52px; background: rgba(255,255,255,0.03); border: 1px solid var(--bdr);
       border-radius: 14px; color: var(--text-muted); font-size: 9px; font-weight: 950;
       letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s;
    }
    .btn-deploy:hover { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.2); }

    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

    @media (max-width: 480px) {
       .actions-grid { grid-template-columns: 1fr; }
       .deploy-actions { grid-template-columns: 1fr; }
    }
  `],
})
export class MServiceHubComponent {
  quickActions = [
    {
      label: 'File Nil Return',
      icon: 'M5 13l4 4L19 7',
      link: '/member/tax-engine/file/nil-return',
      colorClass: 'text-red-500'
    },
    {
      label: 'Check Balance',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      link: '/member/debt',
      colorClass: 'text-red-500'
    },
    {
      label: 'Verify TCC',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      link: '/member/compliance/tcc',
      colorClass: 'text-red-500'
    },
    {
      label: 'Notifications',
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      link: '/member/notifications',
      colorClass: 'text-red-500'
    }
  ];
}
