import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/get_taxpayer_data.php`;
  
  isLoading = signal(false);
  obligations = signal<any[]>([]);
  station = signal('Nairobi North');
  taxpayerProfile = signal<any | null>(null);
  
  // New signals for dashboard
  statistics = signal<any>({
    total_payments: 0,
    total_paid: 0,
    total_pending_amount: 0,
    count_pending_obligations: 0,
    total_returns: 0,
    total_invoices: 0,
    total_revenue: 0
  });
  
  chartData = signal<any[]>([]);
  recentPayments = signal<any[]>([]);
  recentReturns = signal<any[]>([]);

  refreshData(): Observable<any> {
    this.isLoading.set(true);
    return this.http.get<any>(this.apiUrl, { withCredentials: true }).pipe(
      tap({
        next: (res) => {
          this.isLoading.set(false);
          if (res.success && res.data) {
            const d = res.data;
            
            if (d.obligations) this.obligations.set(d.obligations);
            if (d.station) this.station.set(d.station);
            if (d.profile) this.taxpayerProfile.set(d.profile);
            
            // Set new data
            if (d.statistics) this.statistics.set(d.statistics);
            if (d.chart_data) this.chartData.set(d.chart_data);
            if (d.payments) this.recentPayments.set(d.payments);
            if (d.returns) this.recentReturns.set(d.returns);
            
            console.log('📊 Dashboard data refreshed successfully');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Failed to load dashboard data', err);
        }
      })
    );
  }
  /**
   * Set data from external source (AuthService)
   */
  setData(d: any) {
    if (d) {
      console.log('📊 DashboardDataService: Manual state sync');
      if (d.obligations) this.obligations.set(d.obligations);
      if (d.station) this.station.set(d.station);
      if (d.profile) this.taxpayerProfile.set(d.profile);
      if (d.statistics) this.statistics.set(d.statistics);
      if (d.chart_data) this.chartData.set(d.chart_data);
      if (d.payments) this.recentPayments.set(d.payments);
      if (d.returns) this.recentReturns.set(d.returns);
    }
  }
}
