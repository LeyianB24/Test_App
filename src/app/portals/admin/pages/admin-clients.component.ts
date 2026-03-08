import { Component, inject, OnInit, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminClientsService, ClientData } from '../../../services/admin-clients.service';

@Component({
  selector: 'app-admin-clients',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="content-area animate-fade-in">
      
      <!-- Elite Page Header -->
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="header-titles-complex">
            <h1 class="text-3xl font-black text-primary tracking-tight">
              Taxpayer <span class="text-accent">Directory</span>
            </h1>
            <p class="text-[var(--text-secondary)] mt-2 font-semibold tracking-wide uppercase text-[10px]">National Registry Control & Identity Management</p>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex-grow md:flex-grow-0 md:min-w-[300px] relative group">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary transition-colors group-focus-within:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()" 
                placeholder="Query Registry PIN/Identity..." 
                class="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg py-2 pl-9 pr-4 text-xs font-bold transition-all focus:border-accent outline-none">
            </div>
            <button class="btn-precision btn-primary-precision btn-sm" (click)="openForge()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2"><path stroke-width="3" d="M12 4v16m8-8H4"/></svg>
              Enroll Taxpayer
            </button>
            <button class="btn-precision btn-secondary-precision btn-sm" (click)="showImport.set(true)">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2"><path stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              Bulk Ingest
            </button>
          </div>
        </div>
      </header>

      <!-- Summary KPI Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Total Registered</span>
              <h3 class="card-value">{{ totalCount() | number }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-blue-500/5 text-blue-500">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
          </div>
        </div>
        
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Active (30d)</span>
              <h3 class="card-value text-success">{{ activeThisMonth() | number }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-success/5 text-success">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
        </div>

        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Individuals</span>
              <h3 class="card-value">{{ individualCount() | number }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-purple-500/5 text-purple-500">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
          </div>
        </div>

        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Businesses</span>
              <h3 class="card-value text-warning">{{ businessCount() | number }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-warning/5 text-warning">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Directory Surface -->
      <div class="stat-card-precision p-0 overflow-hidden">
        
        <div>
          @if (loading()) {
            <div class="py-32 flex flex-col items-center">
              <div class="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
              <p class="mt-4 text-[10px] font-black text-tertiary uppercase tracking-widest">Synchronizing Registry...</p>
            </div>
          }

          @if (error()) {
            <div class="m-8 p-6 bg-accent/5 border border-accent/10 rounded-2xl text-accent font-bold flex items-center gap-4 animate-shake">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
               <span class="text-xs uppercase tracking-widest">{{ error() }}</span>
            </div>
          }

          @if (!loading() && !error()) {
             <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[var(--bg-surface-2)]/50">
                      <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Taxpayer Identity</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Profile Details</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Classification</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Registration</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Last Active</th>
                      <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary text-right">Protocol</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[var(--border-subtle)]">
                    @for (client of clients(); track client.id) {
                      <tr class="hover:bg-[var(--bg-surface-1)] transition-colors group">
                        <td class="px-8 py-4">
                          <div class="flex flex-col">
                            <span class="text-[9px] font-black text-tertiary uppercase tracking-widest">KRA PIN</span>
                            <span class="text-xs font-black text-primary tracking-tight group-hover:text-accent transition-colors">{{ client.taxpayer_id }}</span>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <span class="text-xs font-black text-primary block truncate max-w-[200px] mb-1 uppercase">{{ client.name }}</span>
                          <span class="text-[9px] font-bold text-tertiary uppercase tracking-widest">{{ client.email }}</span>
                        </td>
                        <td class="px-6 py-4">
                          <div class="status-pill-precision" [class]="client.type === 'individual' ? 'online' : 'pending'">
                            {{ client.type | uppercase }}
                          </div>
                          <span class="text-[9px] font-bold text-tertiary uppercase tracking-widest block mt-2">{{ client.station || 'STATION LOSS' }}</span>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex flex-col">
                            <span class="text-[11px] font-black text-primary uppercase">{{ client.registration_date | date:'dd MMM yyyy' }}</span>
                            <span class="text-[9px] font-bold text-success uppercase tracking-widest">Verified</span>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          @if (client.last_login) {
                            <div class="flex flex-col">
                              <span class="text-[11px] font-black text-primary uppercase">{{ client.last_login | date:'dd MMM yyyy' }}</span>
                              <span class="text-[9px] font-bold text-success uppercase tracking-widest flex items-center gap-1">
                                <span class="w-1 h-1 rounded-full bg-success"></span> SYNCED
                              </span>
                            </div>
                          } @else {
                             <span class="text-[9px] font-black text-tertiary uppercase tracking-widest italic">Never Logged In</span>
                          }
                        </td>
                        <td class="px-8 py-4 text-right">
                           <div class="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                             <button (click)="openForge(client)" class="p-2 hover:text-accent transition-colors" title="Modify Record">
                               <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                             </button>
                             <button (click)="confirmDelete(client)" class="p-2 hover:text-accent transition-colors" title="Purge Record">
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
               <div class="flex flex-col items-center justify-center py-40 animate-fade-in">
                  <div class="w-20 h-20 bg-[var(--bg-surface-2)] rounded-full flex items-center justify-center text-tertiary mb-8">
                     <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <h3 class="text-xl font-black text-primary mb-2">Registry Void</h3>
                  <p class="text-tertiary font-bold uppercase tracking-widest text-[10px] mb-8">No taxpayer identity matched currently syncing cluster</p>
                  <button (click)="searchQuery=''; search()" class="btn-precision btn-secondary-precision btn-sm px-10">
                     Reset Command
                  </button>
               </div>
             }

             <!-- Pagination -->
             @if (totalPages() > 1) {
                <div class="flex justify-between items-center p-8 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
                   <span class="text-[9px] font-black text-tertiary uppercase tracking-widest">
                      Node {{ currentPage() }} of {{ totalPages() }} • {{ totalCount() }} Identity Blocks
                   </span>
                   <div class="flex gap-3">
                      <button class="btn-precision btn-secondary-precision btn-sm px-3" [disabled]="currentPage() === 1" (click)="loadPage(currentPage() - 1)">
                         <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
                      </button>
                      <button class="btn-precision btn-secondary-precision btn-sm px-3" [disabled]="currentPage() === totalPages()" (click)="loadPage(currentPage() + 1)">
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
        <div class="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[var(--text-primary)]/80 backdrop-blur-md animate-fade-in">
          <div class="w-full max-w-2xl bg-[var(--bg-card)] rounded-3xl overflow-hidden shadow-2xl animate-scale border border-[var(--border-subtle)]">
             <div class="p-10 pb-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-surface-1)]">
                <div>
                  <h2 class="text-2xl font-black text-primary uppercase tracking-tight">{{ editingClient() ? 'Modify' : 'Enroll' }} Identity</h2>
                  <p class="text-[10px] font-black text-tertiary uppercase tracking-widest mt-1">Append taxpayer protocol metadata</p>
                </div>
                <button class="w-10 h-10 rounded-xl hover:bg-accent/10 hover:text-accent transition-all flex items-center justify-center" (click)="closeForge()">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
             </div>
             
             <form [formGroup]="clientForm" (ngSubmit)="saveClient()" class="p-10">
                <div class="grid grid-cols-2 gap-8 mb-10">
                  <div class="space-y-3">
                     <label class="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">KRA PIN</label>
                     <input type="text" formControlName="taxpayer_id" 
                        class="w-full bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] rounded-xl py-4 px-6 text-sm font-black focus:border-accent outline-none uppercase shadow-inner" 
                        placeholder="A001234567X">
                  </div>
                  <div class="space-y-3">
                     <label class="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Identity Chain (Name)</label>
                     <input type="text" formControlName="name" 
                        class="w-full bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] rounded-xl py-4 px-6 text-sm font-black focus:border-accent outline-none uppercase shadow-inner" 
                        placeholder="Full Registered Entity">
                  </div>
                  <div class="space-y-3">
                     <label class="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Communication Node (Email)</label>
                     <input type="email" formControlName="email" 
                        class="w-full bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] rounded-xl py-4 px-6 text-sm font-black focus:border-accent outline-none shadow-inner" 
                        placeholder="contact@kra.node">
                  </div>
                  <div class="space-y-3">
                     <label class="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Terminal Unit (Station)</label>
                     <select formControlName="station" 
                        class="w-full bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] rounded-xl py-4 px-6 text-sm font-black focus:border-accent outline-none shadow-inner uppercase">
                       <option value="Nairobi North">Nairobi North</option>
                       <option value="Nairobi South">Nairobi South</option>
                       <option value="Mombasa">Mombasa</option>
                       <option value="Kisumu">Kisumu</option>
                       <option value="Eldoret">Eldoret</option>
                     </select>
                  </div>
                </div>
                
                <div class="flex justify-end gap-4 p-8 bg-[var(--bg-surface-2)] border-t border-[var(--border-subtle)] -m-10 mt-0">
                  <button type="button" class="btn-precision btn-secondary-precision btn-sm px-8" (click)="closeForge()">Abort</button>
                  <button type="submit" class="btn-precision btn-primary-precision btn-sm px-10" [disabled]="clientForm.invalid || saving()">
                     {{ saving() ? 'PROCESSING...' : 'COMMIT CHANGES' }}
                  </button>
                </div>
             </form>
          </div>
        </div>
      }

      <!-- Bulk Ingest Wizard -->
      @if (showImport()) {
        <div class="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[var(--text-primary)]/80 backdrop-blur-md animate-fade-in">
           <div class="w-full max-w-xl bg-[var(--bg-card)] rounded-3xl overflow-hidden shadow-2xl animate-scale border border-[var(--border-subtle)]">
              <div class="p-10 pb-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-surface-1)]">
                 <div>
                    <h2 class="text-2xl font-black text-primary uppercase tracking-tight">Bulk Ingestion</h2>
                    <p class="text-[10px] font-black text-tertiary uppercase tracking-widest mt-1">Mass identity array synchronization</p>
                 </div>
                 <button class="w-10 h-10 rounded-xl hover:bg-accent/10 hover:text-accent transition-all flex items-center justify-center" (click)="showImport.set(false)">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                 </button>
              </div>
              
              <div class="p-10">
                 @if (!importPreview().length) {
                    <div class="border-2 border-dashed border-[var(--border-subtle)] rounded-[2rem] p-16 text-center group hover:border-accent transition-all bg-[var(--bg-surface-2)]/50 cursor-pointer relative">
                       <input type="file" id="csvFile" (change)="onFileSelected($event)" accept=".csv" class="absolute inset-0 opacity-0 cursor-pointer">
                       <div class="flex flex-col items-center">
                          <div class="w-20 h-20 bg-[var(--bg-card)] shadow-xl rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                             <svg width="32" height="32" fill="none" stroke="var(--accent)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                          </div>
                          <span class="text-sm font-black text-primary uppercase tracking-widest">Select Array Fragment (CSV)</span>
                          <p class="text-[9px] text-tertiary font-black uppercase tracking-widest mt-4">Required Vectors: PIN, NAME, EMAIL, STATION</p>
                       </div>
                    </div>
                 } @else {
                    <div class="space-y-6">
                       <h4 class="text-[10px] font-black text-accent uppercase tracking-widest">Calculated Trajectory ({{ importPreview().length }} Blocks)</h4>
                       <div class="max-h-60 overflow-y-auto custom-scrollbar border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface-2)]">
                          <table class="w-full text-left">
                             <thead class="bg-primary/5 text-tertiary uppercase text-[8px] font-black">
                                <tr><th class="p-4 tracking-widest">PIN</th><th class="p-4 tracking-widest">IDENTITY VECTOR</th></tr>
                             </thead>
                             <tbody class="text-primary font-black text-[10px]">
                                @for (row of importPreview().slice(0, 5); track $index) {
                                   <tr class="border-b border-[var(--border-subtle)] last:border-0"><td class="p-4">{{ row.taxpayer_id }}</td><td class="p-4 uppercase">{{ row.name }}</td></tr>
                                }
                             </tbody>
                          </table>
                       </div>
                       <div class="flex justify-end gap-3 mt-10">
                          <button class="btn-precision btn-secondary-precision btn-sm px-8" (click)="importPreview.set([])">Abort</button>
                          <button class="btn-precision btn-primary-precision btn-sm px-10" (click)="processImport()" [disabled]="saving()">EXECUTE INGESTION</button>
                       </div>
                    </div>
                 }
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [``]
})
export class AdminClientsComponent implements OnInit {
  private clientsService = inject(AdminClientsService);
  private fb = inject(FormBuilder);

  loading = signal(true);
  saving = signal(false);
  error = signal('');
  clients = signal<ClientData[]>([]);
  
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
          const all = res.data.clients as any[];
          this.individualCount.set(all.filter(c => c.type === 'individual').length);
          this.businessCount.set(all.filter(c => c.type === 'business').length);
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
         }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result as string;
      const lines = text.split('\n');
      const result = [];
      const headers = lines[0].split(',');

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const obj: any = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
           if (currentline[j]) {
            obj[headers[j].trim()] = currentline[j].trim();
           }
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
          this.loadData();
          this.showImport.set(false);
          this.importPreview.set([]);
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
