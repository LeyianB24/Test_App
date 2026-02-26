import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface AuditLog {
  id: number;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
  details: string;
}

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="audit-container p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">System Audit Log</h1>
        <p class="text-slate-500 mt-1">Traceability and security monitoring for all administrative actions</p>
      </header>

      <div class="card overflow-hidden">
        <div class="table-wrap custom-scrollbar">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-bottom border-slate-100">
                <th class="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Timestamp</th>
                <th class="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">User</th>
                <th class="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Module</th>
                <th class="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Action</th>
                <th class="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">IP Address</th>
                <th class="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              @for (log of logs(); track log.id) {
                <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="text-sm font-bold text-slate-700">{{ log.timestamp.split(' ')[0] }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ log.timestamp.split(' ')[1] }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
                        {{ log.user.substring(0, 2).toUpperCase() }}
                      </div>
                      <span class="text-sm font-bold text-slate-800">{{ log.user }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wide">
                      {{ log.module }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm font-extrabold" [class]="getActionColor(log.action)">
                      {{ log.action }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm font-mono text-slate-400">{{ log.ip }}</td>
                  <td class="px-6 py-4">
                    <p class="text-xs text-slate-500 max-w-xs truncate" [title]="log.details">
                      {{ log.details }}
                    </p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .audit-container { max-width: 1400px; margin: 0 auto; }
    .card { background: white; border-radius: 24px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    .table-wrap { overflow-x: auto; }
    
    .text-success { color: #166534; }
    .text-warning { color: #92400e; }
    .text-error { color: #991b1b; }
    .text-info { color: #0369a1; }
  `]
})
export class AuditLogComponent {
  logs = signal<AuditLog[]>([
    { id: 1, timestamp: '2026-02-24 14:20:05', user: 'Admin User', module: 'Auth', action: 'LOGIN_SUCCESS', ip: '192.168.1.105', details: 'Successful login for A000000000X' },
    { id: 2, timestamp: '2026-02-24 14:25:30', user: 'Super Admin', module: 'Role Matrix', action: 'PERMISSION_UPDATE', ip: '10.0.0.42', details: 'Updated VRN visibility for Helpdesk role' },
    { id: 3, timestamp: '2026-02-24 14:30:12', user: 'Sarah Agent', module: 'Helpdesk', action: 'TICKET_RESOLVE', ip: '192.168.1.112', details: 'Resolved ticket #8852: PIN update request' },
    { id: 4, timestamp: '2026-02-24 14:45:00', user: 'System', module: 'Tax Engine', action: 'BULK_PARSING', ip: '127.0.0.1', details: 'Processed 2,500 eTIMS reconciliation records' },
    { id: 5, timestamp: '2026-02-24 15:00:05', user: 'Admin User', module: 'Settings', action: 'CONFIG_CHANGE', ip: '192.168.1.105', details: 'Modified JWT rotation period to 24h' }
  ]);

  getActionColor(action: string) {
    if (action.includes('SUCCESS') || action.includes('RESOLVE')) return 'text-success';
    if (action.includes('UPDATE') || action.includes('CHANGE')) return 'text-warning';
    if (action.includes('ERROR') || action.includes('FAIL')) return 'text-error';
    return 'text-info';
  }
}
