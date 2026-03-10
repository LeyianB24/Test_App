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
    <div class="db-root">
      <div class="noise-overlay"></div>
      
      <div class="content-area animate-stagger">
        
        <!-- Registry Header Manifold -->
        <header class="mb-14 overflow-hidden relative group">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
            <div class="space-y-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]"></div>
                <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Identity Management</span>
              </div>
              <h1 class="text-5xl font-black text-primary tracking-tighter uppercase leading-none">
                Taxpayer <span class="text-stroke-sm">Registry</span>
              </h1>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                National Identity Matrix Control // Terminal: REG-KRA-NODE-07
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-6">
              <div class="flex-grow md:flex-grow-0 md:min-w-[400px] relative group/search">
                <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-muted group-focus-within/search:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()" 
                  placeholder="Query Registry PIN / Identity Vector..." 
                  class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-black transition-all focus:border-accent/40 outline-none focus:bg-accent/5 tracking-tight uppercase">
              </div>

              <div class="flex gap-4">
                <button class="w-14 h-14 rounded-2xl bg-accent text-white hover:bg-accent/80 transition-all flex items-center justify-center shadow-[0_0_20px_var(--color-accent)]" (click)="openForge()" title="Enroll New Identity">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                </button>
                <button class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all flex items-center justify-center" (click)="showImport.set(true)" title="Bulk Array Ingestion">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Dynamic Intelligence KPIs -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
          <div class="glass-panel p-10 flex items-center justify-between group">
            <div class="space-y-1">
              <span class="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Total Registry</span>
              <h3 class="text-3xl font-black text-primary tracking-tighter tabular-nums">{{ totalCount() | number }}</h3>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:border-primary/30 transition-all">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
          </div>
          
          <div class="glass-panel p-10 flex items-center justify-between group border-[var(--color-success)]/20">
            <div class="space-y-1">
              <span class="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Active nodes (30D)</span>
              <h3 class="text-3xl font-black text-[var(--color-success)] tracking-tighter tabular-nums">{{ activeThisMonth() | number }}</h3>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center border border-[var(--color-success)]/10 transition-all">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="glass-panel p-10 flex items-center justify-between group border-accent/20">
            <div class="space-y-1">
              <span class="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Individual Entities</span>
              <h3 class="text-3xl font-black text-accent tracking-tighter tabular-nums">{{ individualCount() | number }}</h3>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border border-accent/10 transition-all">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
          </div>

          <div class="glass-panel p-10 flex items-center justify-between group border-primary/20">
            <div class="space-y-1">
              <span class="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Corporate Blocks</span>
              <h3 class="text-3xl font-black text-primary tracking-tighter tabular-nums">{{ businessCount() | number }}</h3>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-white/5 text-primary flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-all">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
          </div>
        </div>

        <!-- Registry Data Terminal -->
        <div class="glass-panel overflow-hidden border-white/5">
          @if (loading()) {
            <div class="py-40 flex flex-col items-center justify-center gap-8">
              <div class="relative w-16 h-16">
                <div class="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-t-accent rounded-full animate-spin"></div>
              </div>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Synchronizing Identity Registry...</p>
            </div>
          }

          @if (error()) {
            <div class="m-10 p-10 rounded-3xl bg-accent/5 border border-accent/20 flex flex-col items-center gap-6 animate-shake">
              <svg class="text-accent" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <div class="text-center">
                <p class="text-lg font-black text-primary uppercase tracking-tighter">Handshake Error</p>
                <p class="text-xs font-bold text-muted uppercase tracking-widest mt-2">{{ error() }}</p>
              </div>
              <button (click)="loadData()" class="btn-precision online !px-10 mt-4">Retry Sync</button>
            </div>
          }

          @if (!loading() && !error()) {
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-white/[0.02] border-b border-white/5">
                    <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">Identity Matrix / PIN</th>
                    <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">Legal Entity Vector</th>
                    <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">Configuration</th>
                    <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">Registry Logic</th>
                    <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">Operational Depth</th>
                    <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted text-right">Protocol</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  @for (client of clients(); track client.id) {
                    <tr class="hover:bg-white/[0.03] transition-colors group">
                      <td class="px-10 py-8">
                        <div class="space-y-1">
                          <span class="text-[9px] font-black text-accent uppercase tracking-widest block opacity-60">National ID PIN</span>
                          <span class="text-sm font-black text-primary tracking-tighter font-mono group-hover:text-accent transition-colors">{{ client.taxpayer_id }}</span>
                        </div>
                      </td>
                      <td class="px-8 py-8">
                        <div class="max-w-[280px] space-y-1">
                          <span class="text-sm font-black text-primary uppercase tracking-tighter truncate block">{{ client.name }}</span>
                          <span class="text-[9px] font-black text-muted uppercase tracking-widest block">{{ client.email }}</span>
                        </div>
                      </td>
                      <td class="px-8 py-8">
                        <div class="flex flex-col gap-2">
                          <div class="flex items-center gap-2">
                             <div class="w-1.5 h-1.5 rounded-full" [class]="client.type === 'individual' ? 'bg-accent shadow-[0_0_8px_var(--color-accent)]' : 'bg-primary shadow-[0_0_8px_var(--color-primary)]'"></div>
                             <span class="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{{ client.type || 'UNKNOWN' }}</span>
                          </div>
                          <span class="text-[9px] font-black text-muted uppercase tracking-widest opacity-50">{{ client.station || 'TERMINAL_LOSS' }}</span>
                        </div>
                      </td>
                      <td class="px-8 py-8">
                        <div class="space-y-1">
                          <span class="text-sm font-black text-primary tabular-nums tracking-tighter">{{ client.registration_date | date:'dd MMM yyyy' | uppercase }}</span>
                          <div class="flex items-center gap-2 text-[var(--color-success)]">
                            <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                            <span class="text-[9px] font-black uppercase tracking-[0.2em]">Verified</span>
                          </div>
                        </div>
                      </td>
                      <td class="px-8 py-8">
                        @if (client.last_login) {
                          <div class="space-y-1">
                            <span class="text-sm font-black text-primary tabular-nums tracking-tighter">{{ client.last_login | date:'dd MMM yyyy' | uppercase }}</span>
                            <span class="text-[9px] font-black text-[var(--color-success)] uppercase tracking-widest flex items-center gap-1.5">
                              <span class="w-1 h-1 rounded-full bg-[var(--color-success)] animate-pulse"></span> ACTIVE PULSE
                            </span>
                          </div>
                        } @else {
                          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
                            <span class="text-[9px] font-black text-muted uppercase tracking-widest">NO TELEMETRY</span>
                          </div>
                        }
                      </td>
                      <td class="px-10 py-8 text-right">
                        <div class="flex gap-4 justify-end opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                          <button (click)="openForge(client)" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary hover:border-accent hover:text-accent transition-all" title="Recalibrate Entity">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                          </button>
                          <button (click)="confirmDelete(client)" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all" title="Purge Identity Fragment">
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
              <div class="py-40 flex flex-col items-center justify-center animate-fade-in gap-8">
                <div class="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-muted relative overflow-hidden">
                  <div class="absolute inset-0 bg-accent/5 blur-2xl"></div>
                  <svg class="relative z-10" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div class="text-center space-y-2">
                  <h3 class="text-2xl font-black text-primary uppercase tracking-tighter">Identity Void</h3>
                  <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em]">No taxpayer identity sequences located in current synchronization</p>
                </div>
                <button (click)="searchQuery=''; search()" class="btn-precision online !px-12 mt-4">Recalibrate Command</button>
              </div>
            }

            <!-- Pagination Protocol -->
            @if (totalPages() > 1) {
              <div class="flex justify-between items-center px-10 py-8 border-t border-white/5 bg-white/[0.01]">
                <span class="text-[9px] font-black text-muted uppercase tracking-[0.4em]">
                  Registry Page {{ currentPage() }} of {{ totalPages() }} // {{ totalCount() }} Global Fragments
                </span>
                <div class="flex gap-4">
                  <button class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all flex items-center justify-center disabled:opacity-20" [disabled]="currentPage() === 1" (click)="loadPage(currentPage() - 1)">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all flex items-center justify-center disabled:opacity-20" [disabled]="currentPage() === totalPages()" (click)="loadPage(currentPage() + 1)">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            }
          }
        </div>
      </div>

      <!-- Identity Forge (Enroll/Edit) Modal -->
      @if (showForge()) {
        <div class="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-3xl bg-black/80 animate-fade-in">
          <div class="w-full max-w-3xl glass-panel relative overflow-hidden animate-scale border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
             <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-primary to-accent"></div>
             
             <div class="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div class="space-y-2">
                  <div class="flex items-center gap-3">
                    <div class="w-1 h-4 bg-accent rounded-full"></div>
                    <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Node Configuration</span>
                  </div>
                  <h2 class="text-4xl font-black text-primary uppercase tracking-tighter">{{ editingClient() ? 'Modify' : 'Enroll' }} Identity Vector</h2>
                </div>
                <button class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-accent/10 hover:text-accent transition-all flex items-center justify-center" (click)="closeForge()">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
             </div>
             
             <form [formGroup]="clientForm" (ngSubmit)="saveClient()" class="p-12 space-y-12">
                <div class="grid grid-cols-2 gap-10">
                  <div class="space-y-4">
                     <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Identity PIN Matrix</label>
                     <input type="text" formControlName="taxpayer_id" 
                        class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent/40 outline-none uppercase font-mono tracking-widest shadow-inner placeholder:text-muted/30" 
                        placeholder="A001234567X">
                  </div>
                  <div class="space-y-4">
                     <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Legal Identity Entity</label>
                     <input type="text" formControlName="name" 
                        class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent/40 outline-none uppercase tracking-tight shadow-inner placeholder:text-muted/30" 
                        placeholder="Full Registered Signature">
                  </div>
                  <div class="space-y-4">
                     <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Digital Communication Node</label>
                     <input type="email" formControlName="email" 
                        class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent/40 outline-none shadow-inner placeholder:text-muted/30" 
                        placeholder="identity@kra.national.node">
                  </div>
                  <div class="space-y-4">
                     <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Assigned Command Station</label>
                     <select formControlName="station" 
                        class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent/40 outline-none shadow-inner uppercase appearance-none cursor-pointer">
                       <option value="Nairobi North">Nairobi North Command</option>
                       <option value="Nairobi South">Nairobi South Command</option>
                       <option value="Mombasa">Mombasa Port Node</option>
                       <option value="Kisumu">Kisumu Regional Station</option>
                       <option value="Eldoret">Eldoret North Hub</option>
                     </select>
                  </div>
                </div>
                
                <div class="flex justify-end gap-6 pt-10 border-t border-white/5">
                  <button type="button" class="btn-precision online !bg-white/5 !border-white/10 !text-primary hover:!bg-white/10" (click)="closeForge()">Abort Command</button>
                  <button type="submit" class="btn-precision online !bg-accent !text-white !border-none shadow-[0_0_20px_var(--color-accent)] disabled:opacity-40" [disabled]="clientForm.invalid || saving()">
                     {{ saving() ? 'SYNCHRONIZING...' : 'COMMIT FRAGMENT' }}
                  </button>
                </div>
             </form>
          </div>
        </div>
      }

      <!-- Ingestion Portal (Bulk Import) Modal -->
      @if (showImport()) {
        <div class="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-3xl bg-black/80 animate-fade-in">
           <div class="w-full max-w-2xl glass-panel relative overflow-hidden animate-scale border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
              <div class="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                 <div class="space-y-2">
                    <div class="flex items-center gap-3">
                      <div class="w-1 h-4 bg-primary rounded-full"></div>
                      <span class="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Array Ingestion</span>
                    </div>
                    <h2 class="text-4xl font-black text-primary uppercase tracking-tighter">Bulk Identity Pulse</h2>
                 </div>
                 <button class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-accent/10 hover:text-accent transition-all flex items-center justify-center" (click)="showImport.set(false)">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                 </button>
              </div>
              
              <div class="p-12">
                 @if (!importPreview().length) {
                    <div class="border-2 border-dashed border-white/10 rounded-[3rem] p-24 text-center group hover:border-accent/40 transition-all bg-white/[0.01] cursor-pointer relative overflow-hidden">
                       <div class="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl rounded-full -m-20"></div>
                       <input type="file" id="csvFile" (change)="onFileSelected($event)" accept=".csv" class="absolute inset-0 opacity-0 cursor-pointer z-20">
                       <div class="flex flex-col items-center relative z-10">
                          <div class="w-24 h-24 bg-white/5 shadow-2xl rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform border border-white/5">
                             <svg width="40" height="40" fill="none" class="text-accent" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                          </div>
                          <span class="text-sm font-black text-primary uppercase tracking-[0.3em]">Load Array Source (.CSV)</span>
                          <p class="text-[10px] text-muted font-black uppercase tracking-[0.3em] mt-5">Requirements: PIN, NAME, EMAIL, STATION, TYPE</p>
                       </div>
                    </div>
                 } @else {
                    <div class="space-y-10">
                       <div class="flex items-center justify-between">
                         <h4 class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Trajectory Calculated: {{ importPreview().length }} Blocks</h4>
                         <span class="status-pill-precision online">READY FOR COMMIT</span>
                       </div>
                       
                       <div class="max-h-80 overflow-y-auto custom-scrollbar border border-white/5 rounded-3xl bg-black/40">
                          <table class="w-full text-left">
                             <thead class="bg-white/[0.03] sticky top-0">
                                <tr>
                                  <th class="p-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted">PIN VECTOR</th>
                                  <th class="p-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted">LEGAL SIGNATURE</th>
                                </tr>
                             </thead>
                             <tbody class="text-primary font-black text-[10px]">
                                @for (row of importPreview().slice(0, 10); track $index) {
                                   <tr class="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                      <td class="p-5 font-mono tracking-widest">{{ row.taxpayer_id || row.PIN || row.tax_pin }}</td>
                                      <td class="p-5 uppercase tracking-tighter">{{ row.name || row.NAME }}</td>
                                   </tr>
                                }
                             </tbody>
                          </table>
                       </div>
                       
                       <div class="flex justify-end gap-6 pt-10 border-t border-white/5">
                          <button class="btn-precision online !bg-white/5 !border-white/10 !text-primary" (click)="importPreview.set([])">Abort Ingestion</button>
                          <button class="btn-precision online !bg-accent !text-white !border-none shadow-[0_0_20px_var(--color-accent)]" (click)="processImport()" [disabled]="saving()">INITIATE ARRAY COMMIT</button>
                       </div>
                    </div>
                 }
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .db-root {
      min-height: 100vh;
      background: #050505;
      position: relative;
      overflow-x: hidden;
      color: #e2e8f0;
      padding: 3.5rem;
    }

    .noise-overlay {
      position: fixed;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.015;
      pointer-events: none;
      z-index: 1;
    }

    .content-area {
      position: relative;
      z-index: 2;
      max-width: 1700px;
      margin: 0 auto;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 2.5rem;
    }

    .status-pill-precision {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .online { color: #10b981; }
    .status-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .text-stroke-sm {
      -webkit-text-stroke: 1px currentColor;
      color: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: var(--color-accent);
    }

    .animate-stagger > * {
      animation: stg 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes stg {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
    .animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }

    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .animate-scale { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .animate-shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-1px, 0, 0); }
      40%, 60% { transform: translate3d(1px, 0, 0); }
    }
  `]
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
  pageSize = 12;

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
          this.error.set(res.error || 'Failed to synchronize National Identity Registry fragments.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Network link disrupted during identity heartbeat handshake.');
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
        this.error.set('Failed to commit identity fragment to the National Registry.');
      }
    });
  }

  confirmDelete(client: ClientData) {
    if (confirm(`INITIATE PURGE: Are you absolutely certain you wish to permanently decommission identity vector ${client.taxpayer_id}? This action is irreversible.`)) {
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
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Array ingestion failed. Fragment CRC mismatch in Registry Commit.');
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
