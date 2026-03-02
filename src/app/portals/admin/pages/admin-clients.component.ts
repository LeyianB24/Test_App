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
    <div class="page-container p-8 animate-up">
      <!-- Elite Page Header -->
      <header class="page-header-elite mb-12">
        <div class="header-info">
          <h1 class="premium-title">Taxpayer <span class="gradient-text">Directory</span></h1>
          <p class="premium-subtitle">Manage taxpayer profiles and details</p>
        </div>
        <div class="header-actions flex gap-4">
           <div class="search-premium min-w-[300px]">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()" placeholder="Search PIN, Name, Email..." class="search-input-elite">
           </div>
           <button class="modern-btn primary-btn btn-icon" (click)="openForge()">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
             <span>Add Taxpayer</span>
           </button>
           <button class="modern-btn outline-btn btn-icon" (click)="showImport.set(true)">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
             <span>Bulk Import</span>
           </button>
        </div>
      </header>

      <!-- Summary KPI Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="premium-stat-card p-6 animate-up delay-1">
          <div class="stat-info">
            <span class="stat-label">Total Registered</span>
            <h3 class="stat-number">{{ totalCount() | number }}</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-blue-600">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
        </div>
        
        <div class="premium-stat-card p-6 animate-up delay-2">
          <div class="stat-info">
            <span class="stat-label">Active (30d)</span>
            <h3 class="stat-number text-emerald-600">{{ activeThisMonth() | number }}</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-emerald-600">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>

        <div class="premium-stat-card p-6 animate-up delay-3">
          <div class="stat-info">
            <span class="stat-label">Individuals</span>
            <h3 class="stat-number text-purple-600">{{ individualCount() | number }}</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-purple-600">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
        </div>

        <div class="premium-stat-card p-6 animate-up delay-4">
          <div class="stat-info">
            <span class="stat-label">Businesses</span>
            <h3 class="stat-number text-amber-600">{{ businessCount() | number }}</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-amber-600">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
        </div>
      </div>

      <!-- Main Directory Surface -->
      <div class="content-card-premium relative overflow-hidden animate-up delay-2">
         <div class="absolute -top-20 -right-20 w-80 h-80 bg-slate-50 rounded-full blur-3xl"></div>

         <div class="relative z-10">
            @if (loading()) {
              <div class="py-32 flex flex-col items-center">
                <div class="w-12 h-12 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading records...</p>
              </div>
            }

            @if (error()) {
              <div class="m-8 p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold flex items-center gap-4 animate-scale">
                 <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                 {{ error() }}
              </div>
            }

            @if (!loading() && !error()) {
               <div class="table-responsive-elite">
                  <table class="modern-table-elite w-full">
                    <thead>
                      <tr>
                        <th class="pl-8">Taxpayer Identity</th>
                        <th>Profile Details</th>
                        <th>Classification</th>
                        <th>Registration Status</th>
                        <th>Last Login</th>
                        <th class="pr-8 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (client of clients(); track client.id) {
                        <tr class="table-row-hover group">
                          <td class="pl-8">
                            <span class="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-[0.15em]">KRA PIN</span>
                            <span class="font-black text-slate-800 tracking-tight text-sm break-all group-hover:text-red-600 transition-colors">{{ client.taxpayer_id }}</span>
                          </td>
                          <td>
                            <span class="font-black text-slate-800 block truncate max-w-[200px] mb-1 text-sm">{{ client.name }}</span>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ client.email }}</span>
                          </td>
                          <td>
                            <div class="status-pill-elite shadow-sm" [class]="client.type === 'individual' ? 'synced' : 'pending'">
                              <span class="dot"></span>
                              {{ client.type | uppercase }}
                            </div>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-2 ml-2">{{ client.station || 'Station: Unassigned' }}</span>
                          </td>
                          <td>
                            <span class="text-xs font-black text-slate-700 block mb-1">{{ client.registration_date | date:'dd MMM yyyy' }}</span>
                            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified</span>
                          </td>
                          <td>
                            @if (client.last_login) {
                               <span class="text-xs font-black text-slate-700 block mb-1">{{ client.last_login | date:'dd MMM yyyy' }}</span>
                               <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1">
                                  <span class="w-1 h-1 rounded-full bg-emerald-500"></span> Online
                               </span>
                            } @else {
                               <span class="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Never Logged In</span>
                            }
                          </td>
                          <td class="pr-8 text-right">
                             <div class="flex gap-3 justify-end">
                               <button (click)="openForge(client)" class="icon-btn-elite hover:bg-red-50 hover:text-red-600 transition-all transform hover:scale-110" title="Edit Record">
                                 <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                               </button>
                               <button (click)="confirmDelete(client)" class="icon-btn-elite hover:bg-red-600 hover:text-white transition-all transform hover:scale-110" title="Delete Record">
                                 <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                               </button>
                             </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
               </div>

               @if (clients().length === 0) {
                 <div class="flex flex-col items-center justify-center py-40 animate-scale">
                    <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
                       <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <h3 class="text-xl font-black text-slate-800 mb-2">Null Sector Detected</h3>
                    <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">No sovereign records match current filtration parameters</p>
                    <button (click)="searchQuery=''; search()" class="modern-btn primary-btn">
                       Reset Directory
                    </button>
                 </div>
               }

               <!-- Pagination -->
               @if (totalPages() > 1) {
                  <div class="flex justify-between items-center p-8 border-t border-slate-50 bg-slate-50/30">
                     <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Page {{ currentPage() }} of {{ totalPages() }} • {{ totalCount() }} Total Records
                     </span>
                     <div class="flex gap-3">
                        <button class="icon-btn-elite" [disabled]="currentPage() === 1" (click)="loadPage(currentPage() - 1)">
                           <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button class="icon-btn-elite" [disabled]="currentPage() === totalPages()" (click)="loadPage(currentPage() + 1)">
                           <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                     </div>
                  </div>
               }
            }
         </div>
      </div>

      <!-- Client Forge Modal -->
      @if (showForge()) {
        <div class="modal-overlay">
          <div class="modal-card animate-scale p-1 bg-gradient-to-br from-red-600 to-red-400 max-w-2xl shadow-2xl">
            <div class="bg-white rounded-[1.8rem] overflow-hidden">
               <div class="p-10 pb-6 border-b border-slate-50 flex justify-between items-center">
                  <div>
                    <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">{{ editingClient() ? 'Edit' : 'Add' }} Taxpayer</h2>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Provide taxpayer details</p>
                  </div>
                  <button class="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-400 transition-colors flex items-center justify-center font-black text-xl" (click)="closeForge()">&times;</button>
               </div>
               
               <form [formGroup]="clientForm" (ngSubmit)="saveClient()" class="p-10">
                  <div class="grid grid-cols-2 gap-8 mb-10">
                    <div class="space-y-3">
                       <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">KRA PIN</label>
                       <input type="text" formControlName="taxpayer_id" class="search-input-elite w-full h-[3.5rem] bg-slate-50 border-slate-100 focus:bg-white" placeholder="A001234567X">
                    </div>
                    <div class="space-y-3">
                       <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Full Name</label>
                       <input type="text" formControlName="name" class="search-input-elite w-full h-[3.5rem] bg-slate-50 border-slate-100 focus:bg-white" placeholder="Full Registered Name">
                    </div>
                    <div class="space-y-3">
                       <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Email Address</label>
                       <input type="email" formControlName="email" class="search-input-elite w-full h-[3.5rem] bg-slate-50 border-slate-100 focus:bg-white" placeholder="contact@example.com">
                    </div>
                    <div class="space-y-3">
                       <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Tax Station</label>
                       <select formControlName="station" class="search-input-elite w-full h-[3.5rem] bg-slate-50 border-slate-100 focus:bg-white appearance-none">
                         <option value="Nairobi North">Nairobi North</option>
                         <option value="Nairobi South">Nairobi South</option>
                         <option value="Mombasa">Mombasa</option>
                         <option value="Kisumu">Kisumu</option>
                         <option value="Eldoret">Eldoret</option>
                       </select>
                    </div>
                  </div>
                  
                  <div class="flex justify-end gap-4 p-8 bg-slate-50/50 rounded-[2rem]">
                    <button type="button" class="modern-btn outline-btn sm" (click)="closeForge()">Cancel</button>
                    <button type="submit" class="modern-btn primary-btn sm" [disabled]="clientForm.invalid || saving()">
                       {{ saving() ? 'Saving...' : 'Save Record' }}
                    </button>
                  </div>
               </form>
            </div>
          </div>
        </div>
      }

      <!-- Bulk Ingest Wizard -->
      @if (showImport()) {
        <div class="modal-overlay">
           <div class="modal-card animate-scale p-1 bg-slate-900 max-w-xl shadow-2xl">
              <div class="bg-white rounded-[1.8rem] overflow-hidden">
                 <div class="p-10 pb-6 border-b border-slate-50 flex justify-between items-center">
                    <div>
                       <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Bulk Import</h2>
                       <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Upload multiple records via CSV</p>
                    </div>
                    <button class="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-400 transition-colors flex items-center justify-center font-black text-xl" (click)="showImport.set(false)">&times;</button>
                 </div>
                 
                 <div class="p-10">
                    @if (!importPreview().length) {
                       <div class="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center group hover:border-red-400 transition-all bg-slate-50/50">
                          <input type="file" id="csvFile" (change)="onFileSelected($event)" accept=".csv" class="hidden">
                          <label for="csvFile" class="cursor-pointer flex flex-col items-center">
                             <div class="w-20 h-20 bg-white shadow-xl rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg width="32" height="32" fill="none" stroke="#E31E24" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                             </div>
                             <span class="text-sm font-black text-slate-700 uppercase tracking-widest">Select CSV File</span>
                             <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-4">Required fields: PIN, NAME, EMAIL, STATION</p>
                          </label>
                       </div>
                    } @else {
                       <div class="space-y-6">
                          <h4 class="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">Ready to Import ({{ importPreview().length }} Records)</h4>
                          <div class="max-h-60 overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl">
                             <table class="w-full text-[11px] font-bold">
                                <thead class="bg-slate-50 text-slate-400 uppercase text-[9px]">
                                   <tr><th class="p-3 text-left">PIN</th><th class="p-3 text-left">IDENTITY</th></tr>
                                </thead>
                                <tbody class="text-slate-700">
                                   @for (row of importPreview().slice(0, 5); track $index) {
                                      <tr class="border-b border-slate-50 last:border-0"><td class="p-3">{{ row.taxpayer_id }}</td><td class="p-3">{{ row.name }}</td></tr>
                                   }
                                </tbody>
                             </table>
                          </div>
                          <div class="flex justify-end gap-3 mt-10">
                             <button class="modern-btn outline-btn sm" (click)="importPreview.set([])">Cancel</button>
                             <button class="modern-btn primary-btn sm" (click)="processImport()" [disabled]="saving()">Import Records</button>
                          </div>
                       </div>
                    }
                 </div>
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 1600px; margin: 0 auto; }
    
    .search-premium {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1.5px solid rgba(226, 232, 240, 0.8);
      border-radius: 1.2rem;
      padding: 0 1.2rem;
      height: 3rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .search-premium:focus-within {
      border-color: #E31E24;
      box-shadow: 0 8px 24px rgba(227, 30, 36, 0.12);
      transform: translateY(-1px);
      background: white;
    }
    .search-premium svg { color: #94A3B8; margin-right: 0.8rem; }
    .search-input-elite {
      background: transparent;
      border: none;
      outline: none;
      width: 100%;
      font-size: 0.85rem;
      font-weight: 700;
      color: #1E293B;
    }
    .search-input-elite::placeholder { color: #CBD5E1; font-weight: 600; }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }
    .modal-card {
      width: 100%;
      border-radius: 2rem;
      overflow: hidden;
    }

    .table-responsive-elite { overflow-x: auto; }
    .modern-table-elite { border-collapse: separate; border-spacing: 0; }
    .modern-table-elite th {
      padding: 1.5rem 1rem;
      background: #F8FAFC;
      text-align: left;
      font-size: 0.65rem;
      font-weight: 900;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      border-bottom: 1px solid #F1F5F9;
    }
    .table-row-hover { transition: all 0.2s; cursor: default; }
    .table-row-hover td { padding: 1.5rem 1rem; border-bottom: 1px solid #F8FAFC; }
    .table-row-hover:hover { background: #FAFAFA; }

    .icon-btn-elite {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.8rem;
      background: white;
      border: 1px solid #F1F5F9;
      color: #94A3B8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }

    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .animate-scale { animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
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
          alert('Save Failed: ' + (res.error || 'Unknown error'));
        }
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }

  confirmDelete(client: ClientData) {
    if (confirm(`Are you sure you want to delete the record for ${client.taxpayer_id}?`)) {
      this.clientsService.deleteClient(client.id).subscribe({
        next: (res) => {
          if (res.success) this.loadData();
          else alert('Delete Error: ' + res.error);
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
          alert('Import Failure: ' + res.error);
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
