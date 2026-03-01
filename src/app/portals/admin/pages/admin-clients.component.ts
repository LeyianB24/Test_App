import { Component, inject, OnInit, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminClientsService, ClientData } from '../../../services/admin-clients.service';

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="page-container animate-up">
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Taxpayer <span class="gradient-text">Directory</span></h1>
          <p class="premium-subtitle">Manage client accounts, compliance status, and system access</p>
        </div>
        <div class="header-actions">
           <div class="search-box mr-12">
             <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()" placeholder="Search PIN, Name, Email..." class="premium-input">
             <button class="search-btn" (click)="search()">
               <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </button>
           </div>
           <button class="btn-premium mr-8" (click)="openForge()">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
             Client Forge
           </button>
           <button class="btn-premium-outline" (click)="showImport.set(true)">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
             Bulk Ingest
           </button>
        </div>
      </header>

      <!-- Summary KPI Row -->
      <div class="kpi-summary-row">
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon kmi-blue">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div>
            <div class="kmi-val">{{ totalCount() | number }}</div>
            <div class="kmi-lbl">Total Registered</div>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon kmi-green">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <div class="kmi-val">{{ activeThisMonth() | number }}</div>
            <div class="kmi-lbl">Active This Month</div>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon kmi-purple">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div>
            <div class="kmi-val">{{ individualCount() | number }}</div>
            <div class="kmi-lbl">Individuals</div>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon kmi-amber">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <div>
            <div class="kmi-val">{{ businessCount() | number }}</div>
            <div class="kmi-lbl">Businesses</div>
          </div>
        </div>
      </div>

      <div *ngIf="loading()" class="loading-state flex flex-col items-center justify-center p-12">
        <div class="spin"></div>
        <p class="mt-4 text-muted" style="color: var(--text-muted); margin-top: 1rem;">Loading directory...</p>
      </div>

      <div *ngIf="error()" class="error-banner">
        {{ error() }}
      </div>

      <div *ngIf="!loading() && !error()" class="content-card-premium table-responsive-elite glassmorphism">
        <table class="elite-table">
          <thead>
            <tr>
              <th>ID / Taxpayer PIN</th>
              <th>Name & Contact</th>
              <th>Type / Station</th>
              <th>Registration</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of clients()">
              <td>
                <span class="font-bold text-main block">{{ client.taxpayer_id }}</span>
                <span class="text-xs text-muted">ID: {{ client.id }}</span>
              </td>
              <td>
                <span class="font-bold text-main block">{{ client.name }}</span>
                <span class="text-xs text-muted block">{{ client.email }}</span>
                <span class="text-xs text-muted" *ngIf="client.phone">{{ client.phone }}</span>
              </td>
              <td>
                <span class="badge" [class.badge-blue]="client.type === 'individual'" [class.badge-purple]="client.type === 'business'">{{ client.type | uppercase }}</span>
                <span class="text-xs text-muted block mt-1">{{ client.station || 'Unassigned' }}</span>
              </td>
              <td>
                <span class="text-sm">{{ client.registration_date | date:'mediumDate' }}</span>
              </td>
              <td>
                <span class="text-sm" *ngIf="client.last_login">{{ client.last_login | date:'mediumDate' }}</span>
                <span class="text-sm text-muted" *ngIf="!client.last_login">Never</span>
              </td>
              <td>
                <div class="flex gap-2">
                  <button class="icon-btn" title="Edit Client" (click)="openForge(client)">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                  <button class="icon-btn delete" title="Delete Client" (click)="confirmDelete(client)">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="clients().length === 0">
              <td colspan="6" class="text-center p-8 text-muted">No clients found matching criteria</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="pagination flex justify-between items-center mt-6 pt-4 border-t border-gray-100" *ngIf="totalPages() > 1">
          <div class="text-sm text-muted font-bold">
             Showing page {{ currentPage() }} of {{ totalPages() }} ({{ totalCount() }} total)
          </div>
          <div class="flex gap-2">
            <button class="page-btn" [disabled]="currentPage() === 1" (click)="loadPage(currentPage() - 1)">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button class="page-btn" [disabled]="currentPage() === totalPages()" (click)="loadPage(currentPage() + 1)">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Client Forge Modal -->
      <div class="modal-overlay" *ngIf="showForge()">
        <div class="modal-card animate-scale glassmorphism">
          <div class="modal-header">
            <h2 class="modal-title">{{ editingClient() ? 'Edit' : 'Create' }} Taxpayer Record</h2>
            <button class="close-btn" (click)="closeForge()">&times;</button>
          </div>
          <form [formGroup]="clientForm" (ngSubmit)="saveClient()" class="modal-body">
             <div class="form-grid">
               <div class="form-group">
                 <label>Taxpayer PIN</label>
                 <input type="text" formControlName="taxpayer_id" class="premium-input-full" placeholder="e.g. T001234567X">
               </div>
               <div class="form-group">
                 <label>Full Name</label>
                 <input type="text" formControlName="name" class="premium-input-full" placeholder="Legally Registered Name">
               </div>
               <div class="form-group">
                 <label>Email Address</label>
                 <input type="email" formControlName="email" class="premium-input-full" placeholder="contact@domain.com">
               </div>
               <div class="form-group">
                 <label>Phone Number</label>
                 <input type="text" formControlName="phone" class="premium-input-full" placeholder="+254 7XX XXX XXX">
               </div>
               <div class="form-group">
                 <label>Station</label>
                 <select formControlName="station" class="premium-input-full">
                   <option value="Nairobi North">Nairobi North</option>
                   <option value="Nairobi South">Nairobi South</option>
                   <option value="Mombasa">Mombasa</option>
                   <option value="Kisumu">Kisumu</option>
                   <option value="Eldoret">Eldoret</option>
                 </select>
               </div>
               <div class="form-group">
                 <label>KRA PIN (Secondary Verification)</label>
                 <input type="text" formControlName="kra_pin" class="premium-input-full" placeholder="Verify PIN">
               </div>
             </div>
             
             <div class="modal-actions mt-24">
               <button type="button" class="btn-premium-outline" (click)="closeForge()">Cancel</button>
               <button type="submit" class="btn-premium" [disabled]="clientForm.invalid || saving()">
                 {{ saving() ? 'Processing...' : 'Forge Record' }}
               </button>
             </div>
          </form>
        </div>
      </div>

      <!-- Bulk Ingest Wizard -->
      <div class="modal-overlay" *ngIf="showImport()">
        <div class="modal-card import-card animate-scale glassmorphism">
           <div class="modal-header">
             <h2 class="modal-title">Bulk Ingest Portal</h2>
             <button class="close-btn" (click)="showImport.set(false)">&times;</button>
           </div>
           <div class="modal-body">
              <div class="upload-zone" *ngIf="!importPreview().length">
                <input type="file" id="csvFile" (change)="onFileSelected($event)" accept=".csv" class="hidden">
                <label for="csvFile" class="upload-label">
                   <svg class="w-12 h-12 mb-4 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                   <span>Drop CSV here or click to browse</span>
                   <p class="text-xs text-muted mt-4">Expected columns: taxpayer_id, name, email, phone, station, kra_pin</p>
                </label>
              </div>

              <div class="preview-zone" *ngIf="importPreview().length">
                 <h4 class="text-sm font-black mb-12 uppercase tracking-widest text-blue">Data Validation Preview ({{ importPreview().length }} records)</h4>
                 <div class="preview-table-container custom-scrollbar">
                    <table class="preview-table">
                       <thead>
                         <tr>
                            <th>PIN</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Station</th>
                         </tr>
                       </thead>
                       <tbody>
                         @for (row of importPreview().slice(0, 5); track $index) {
                           <tr>
                             <td>{{ row.taxpayer_id }}</td>
                             <td>{{ row.name }}</td>
                             <td>{{ row.email }}</td>
                             <td>{{ row.station }}</td>
                           </tr>
                         }
                       </tbody>
                    </table>
                    <p class="text-xs italic mt-8" *ngIf="importPreview().length > 5">+ {{ importPreview().length - 5 }} more records...</p>
                 </div>
                 
                 <div class="modal-actions mt-24">
                    <button class="btn-premium-outline" (click)="importPreview.set([])">Clear</button>
                    <button class="btn-premium" (click)="processImport()" [disabled]="saving()">
                      {{ saving() ? 'Ingesting...' : 'Start Bulk Import' }}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .glassmorphism {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    }

    /* KPI Summary Row */
    .kpi-summary-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
    @media (max-width: 768px) { .kpi-summary-row { grid-template-columns: 1fr 1fr; } }
    .kpi-mini-card { background: #fff; border: 1px solid #F1F5F9; border-radius: 18px; padding: 18px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 8px rgba(0,0,0,.04); transition: transform .3s,box-shadow .3s; }
    .kpi-mini-card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(0,0,0,.07); }
    .kpi-mini-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .kmi-blue   { background: rgba(59,130,246,.1); color: #3B82F6; }
    .kmi-green  { background: rgba(16,185,129,.1); color: #10B981; }
    .kmi-purple { background: rgba(139,92,246,.1); color: #8B5CF6; }
    .kmi-amber  { background: rgba(245,158,11,.1); color: #F59E0B; }
    .kmi-val  { font-size: 1.35rem; font-weight: 900; color: #1E293B; line-height: 1; }
    .kmi-lbl  { font-size: .68rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; margin-top: 3px; }

    .mr-12 { margin-right: 12px; }
    .mr-8 { margin-right: 8px; }
    .mt-24 { margin-top: 24px; }
    .mb-24 { margin-bottom: 24px; }
    .mb-12 { margin-bottom: 12px; }
    .mb-8 { margin-bottom: 8px; }

    .search-box { display: flex; align-items: center; background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
    .premium-input { border: none; background: transparent; padding: 8px 16px; outline: none; width: 220px; color: #1E293B; font-size: 0.85rem; }
    .premium-input-full { width: 100%; padding: 12px 16px; border: 1.5px solid #E2E8F0; border-radius: 12px; outline: none; font-size: 0.9rem; transition: border 0.2s; }
    .premium-input-full:focus { border-color: #3B82F6; }
    .search-btn { background: #E2E8F0; color: #64748B; border: none; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
    .search-btn:hover { background: #3B82F6; color: white; }

    .elite-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
    .elite-table th { text-align: left; padding: 12px 16px; font-size: 0.75rem; font-weight: 900; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; }
    .elite-table tbody tr { background: white; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.01); }
    .elite-table tbody tr:hover { transform: scale(1.005); box-shadow: 0 4px 12px rgba(0,0,0,0.04); background: #F8FAFC; }
    .elite-table td { padding: 16px; vertical-align: middle; }
    .elite-table td:first-child { border-radius: 12px 0 0 12px; }
    .elite-table td:last-child { border-radius: 0 12px 12px 0; }

    .badge { padding: 4px 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 950; letter-spacing: 0.5px; }
    .badge-blue { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
    .badge-purple { background: rgba(139, 92, 246, 0.1); color: #7C3AED; }

    .icon-btn { width: 32px; height: 32px; border-radius: 8px; border: none; background: #F1F5F9; color: #64748B; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
    .icon-btn:hover { background: #3B82F6; color: white; transform: rotate(15deg); }
    .icon-btn.delete:hover { background: #EF4444; color: white; }

    .pagination { padding: 1.5rem 0; }
    .page-btn { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B; transition: 0.2s; }
    .page-btn:hover:not(:disabled) { border-color: #3B82F6; color: #3B82F6; }
    .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    /* Modal Styling */
    .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-card { width: 100%; max-width: 650px; border-radius: 28px; overflow: hidden; }
    .import-card { max-width: 500px; }
    .modal-header { padding: 24px 32px; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; }
    .modal-title { font-size: 1.25rem; font-weight: 900; color: #1E293B; margin: 0; }
    .close-btn { background: none; border: none; font-size: 1.5rem; color: #94A3B8; cursor: pointer; }
    .modal-body { padding: 32px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .form-group label { display: block; font-size: 0.75rem; font-weight: 900; color: #64748B; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; }

    /* Import Wizard */
    .upload-zone { border: 2px dashed #CBD5E1; border-radius: 24px; padding: 48px; text-align: center; background: rgba(248, 250, 252, 0.5); transition: all 0.2s; }
    .upload-zone:hover { border-color: #3B82F6; background: rgba(59, 130, 246, 0.05); }
    .upload-label { cursor: pointer; display: flex; flex-direction: column; align-items: center; }
    .upload-label span { font-weight: 800; font-size: 1rem; color: #334155; }
    .preview-table-container { max-height: 250px; overflow-y: auto; border: 1px solid #E2E8F0; border-radius: 12px; background: white; }
    .preview-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    .preview-table th { background: #F8FAFC; padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: left; }
    .preview-table td { padding: 10px; border-bottom: 1px solid #F1F5F9; }
    .hidden { display: none; }

    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .animate-scale { animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  `]
})
export class AdminClientsComponent implements OnInit {
  private clientsService = inject(AdminClientsService);
  private fb = inject(FormBuilder);

  loading = signal(true);
  saving = signal(false);
  error = signal('');
  clients = signal<ClientData[]>([]);
  
  // Forge State
  showForge = signal(false);
  editingClient = signal<ClientData | null>(null);
  clientForm = this.fb.group({
    id: [null],
    taxpayer_id: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    station: ['Nairobi North'],
    kra_pin: ['']
  });

  // Import State
  showImport = signal(false);
  importPreview = signal<any[]>([]);
  
  currentPage = signal(1);
  totalPages = signal(1);
  totalCount = signal(0);
  activeThisMonth = signal(0);
  individualCount = signal(0);
  businessCount = signal(0);
  searchQuery = '';
  pageSize = 10;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set('');
    
    this.clientsService.getClients(this.currentPage(), this.pageSize, this.searchQuery).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.clients.set(res.data.clients);
          this.currentPage.set(res.data.pagination.page);
          this.totalPages.set(res.data.pagination.pages);
          this.totalCount.set(res.data.pagination.total);
          // Derive KPI counts from returned clients
          const all = res.data.clients as any[];
          this.individualCount.set(all.filter(c => c.type === 'individual').length);
          this.businessCount.set(all.filter(c => c.type === 'business').length);
          // Active this month: last_login within 30 days
          const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
          this.activeThisMonth.set(all.filter(c => c.last_login && new Date(c.last_login) >= cutoff).length);
        } else {
          this.error.set(res.error || 'Failed to fetch directory data.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Network error encountered while fetching directory.');
        this.loading.set(false);
      }
    });
  }

  openForge(client?: ClientData) {
    if (client) {
      this.editingClient.set(client);
      this.clientForm.patchValue({
        id: client.id as any,
        taxpayer_id: client.taxpayer_id,
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        station: client.station || 'Nairobi North',
        kra_pin: client.kra_pin || ''
      });
    } else {
      this.editingClient.set(null);
      this.clientForm.reset({ station: 'Nairobi North' });
    }
    this.showForge.set(true);
  }

  closeForge() {
    this.showForge.set(false);
    this.editingClient.set(null);
  }

  saveClient() {
    if (this.clientForm.invalid) return;
    this.saving.set(true);
    
    this.clientsService.upsertClient(this.clientForm.value as any).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadData();
          this.closeForge();
        } else {
          alert('Forge Failure: ' + (res.error || 'Unknown error'));
        }
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }

  confirmDelete(client: ClientData) {
    if (confirm(`Are you certain you want to redact record ${client.taxpayer_id}? This is audited.`)) {
      this.clientsService.deleteClient(client.id).subscribe({
        next: (res) => {
          if (res.success) this.loadData();
          else alert('Redaction Error: ' + res.error);
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result;
      const lines = text.split('\\n');
      const result = [];
      const headers = lines[0].split(',');

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const obj: any = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].trim()] = currentline[j].trim();
        }
        result.push(obj);
      }
      this.importPreview.set(result);
    };
    reader.readAsText(file);
  }

  processImport() {
    if (!this.importPreview().length) return;
    this.saving.set(true);
    
    this.clientsService.importClients(this.importPreview()).subscribe({
      next: (res) => {
        if (res.success) {
          alert(res.message);
          this.loadData();
          this.showImport.set(false);
          this.importPreview.set([]);
        } else {
          alert('Ingest Failure: ' + res.error);
        }
        this.saving.set(false);
      }
    });
  }
  
  loadPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadData();
    }
  }
  
  search() {
    this.currentPage.set(1);
    this.loadData();
  }
}
