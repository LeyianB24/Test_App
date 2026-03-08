import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Ticket {
  id: number;
  ticket_number: string;
  subject: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed' | 'Reopened';
  created_by: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
  first_response_at?: string;
  resolved_at?: string;
  closed_at?: string;
  progress_percentage?: number;
  replies?: TicketReply[];
  attachments?: TicketAttachment[];
  history?: TicketHistory[];
}

export interface TicketReply {
  id: number;
  ticket_id: number;
  reply_text: string;
  is_internal: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface TicketAttachment {
  id: number;
  ticket_id: number;
  filename: string;
  file_size: number;
  file_type: string;
  created_at: string;
  uploaded_by: number;
}

export interface TicketHistory {
  id: number;
  ticket_id: number;
  change_type: string;
  old_value?: string;
  new_value?: string;
  description: string;
  changed_by: number;
  changed_at: string;
}

export interface TicketListResponse {
  tickets: Ticket[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    pages: number;
  };
}

export interface TicketSLA {
  id: number;
  priority: string;
  response_time_hours: number;
  resolution_time_hours: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class HelpdeskService {
  private apiUrl = `${environment.apiUrl}/helpdesk_api.php`;

  // State signals
  private ticketsSignal = signal<Ticket[]>([]);
  private currentTicketSignal = signal<Ticket | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string>('');
  private categoriesSignal = signal<string[]>([]);
  private slasSignal = signal<TicketSLA[]>([]);

  // Computed signals
  public tickets = computed(() => this.ticketsSignal());
  public currentTicket = computed(() => this.currentTicketSignal());
  public isLoading = computed(() => this.loadingSignal());
  public error = computed(() => this.errorSignal());
  public categories = computed(() => this.categoriesSignal());
  public slas = computed(() => this.slasSignal());

  // Statistics
  public openTicketsCount = computed(() =>
    this.ticketsSignal().filter(t => t.status === 'Open').length
  );
  public inProgressCount = computed(() =>
    this.ticketsSignal().filter(t => t.status === 'In Progress').length
  );
  public resolvedCount = computed(() =>
    this.ticketsSignal().filter(t => ['Resolved', 'Closed'].includes(t.status)).length
  );
  public waitingCount = computed(() =>
    this.ticketsSignal().filter(t => t.status === 'Waiting for Customer').length
  );

  private http = inject(HttpClient);

  constructor() {
    this.loadCategories();
    this.loadSLAs();
  }

  /**
   * List tickets with filtering and pagination
   */
  public listTickets(filters?: {
    status?: string;
    priority?: string;
    category?: string;
    assigned_to?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
    limit?: number;
    offset?: number;
  }): Observable<TicketListResponse> {
    this.loadingSignal.set(true);

    let params = new HttpParams().set('action', 'list');

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.assigned_to) params = params.set('assigned_to', filters.assigned_to.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.sort_by) params = params.set('sort_by', filters.sort_by);
      if (filters.sort_order) params = params.set('sort_order', filters.sort_order);
      params = params.set('limit', (filters.limit || 50).toString());
      params = params.set('offset', (filters.offset || 0).toString());
    }

    return new Observable(observer => {
      this.http.get<any>(this.apiUrl, { params }).subscribe({
        next: (response) => {
          if (response.success) {
            this.ticketsSignal.set(response.data.tickets);
            this.errorSignal.set('');
            observer.next(response.data);
            observer.complete();
          } else {
            this.errorSignal.set(response.message);
            observer.error(response.message);
          }
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set('Failed to load tickets');
          this.loadingSignal.set(false);
          observer.error(err);
        }
      });
    });
  }

  public getCategories(): Observable<any> {
    const params = new HttpParams().set('action', 'get_categories');
    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * Get single ticket details
   */
  public getTicket(ticketId: number): Observable<Ticket> {
    this.loadingSignal.set(true);

    const params = new HttpParams()
      .set('action', 'get')
      .set('id', ticketId.toString());

    return new Observable(observer => {
      this.http.get<any>(this.apiUrl, { params }).subscribe({
        next: (response) => {
          if (response.success) {
            this.currentTicketSignal.set(response.data);
            this.errorSignal.set('');
            observer.next(response.data);
            observer.complete();
          } else {
            this.errorSignal.set(response.message);
            observer.error(response.message);
          }
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set('Failed to load ticket');
          this.loadingSignal.set(false);
          observer.error(err);
        }
      });
    });
  }

  /**
   * Create new ticket
   */
  public createTicket(data: {
    subject: string;
    description: string;
    category: string;
    priority?: string;
  }): Observable<{ ticket_id: number; ticket_number: string }> {
    this.loadingSignal.set(true);

    return new Observable(observer => {
      this.http.post<any>(
        `${this.apiUrl}?action=create`,
        data
      ).subscribe({
        next: (response) => {
          if (response.success) {
            this.errorSignal.set('');
            observer.next(response.data);
            observer.complete();
          } else {
            this.errorSignal.set(response.message);
            observer.error(response.message);
          }
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set('Failed to create ticket');
          this.loadingSignal.set(false);
          observer.error(err);
        }
      });
    });
  }

  /**
   * Update ticket (status, priority, assignment)
   */
  public updateTicket(ticketId: number, updates: {
    status?: string;
    priority?: string;
    assigned_to?: number;
  }): Observable<{ ticket_id: number }> {
    this.loadingSignal.set(true);

    return new Observable(observer => {
      this.http.post<any>(
        `${this.apiUrl}?action=update&id=${ticketId}`,
        updates
      ).subscribe({
        next: (response) => {
          if (response.success) {
            this.errorSignal.set('');
            observer.next(response.data);
            observer.complete();
          } else {
            this.errorSignal.set(response.message);
            observer.error(response.message);
          }
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set('Failed to update ticket');
          this.loadingSignal.set(false);
          observer.error(err);
        }
      });
    });
  }

  /**
   * Add reply/comment to ticket
   */
  public addReply(ticketId: number, replyText: string, isInternal: boolean = false): Observable<{ reply_id: number }> {
    return new Observable(observer => {
      this.http.post<any>(
        `${this.apiUrl}?action=add_reply&id=${ticketId}`,
        { reply_text: replyText, is_internal: isInternal }
      ).subscribe({
        next: (response) => {
          if (response.success) {
            this.errorSignal.set('');
            observer.next(response.data);
            observer.complete();
          } else {
            this.errorSignal.set(response.message);
            observer.error(response.message);
          }
        },
        error: (err) => {
          this.errorSignal.set('Failed to add reply');
          observer.error(err);
        }
      });
    });
  }

  /**
   * Load ticket categories
   */
  private loadCategories(): void {
    const params = new HttpParams().set('action', 'get_categories');

    this.http.get<any>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        if (response.success) {
          this.categoriesSignal.set(response.data.categories);
        }
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  /**
   * Load SLA configurations
   */
  private loadSLAs(): void {
    const params = new HttpParams().set('action', 'get_sla');

    this.http.get<any>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        if (response.success) {
          this.slasSignal.set(response.data.slas);
        }
      },
      error: (err) => console.error('Failed to load SLAs', err)
    });
  }

  /**
   * Get SLA for specific priority
   */
  public getSLAForPriority(priority: string): TicketSLA | undefined {
    return this.slasSignal().find(sla => sla.priority === priority);
  }

  /**
   * Clear current ticket
   */
  public clearCurrentTicket(): void {
    this.currentTicketSignal.set(null);
  }

  /**
   * Clear all signals (on logout)
   */
  public clear(): void {
    this.ticketsSignal.set([]);
    this.currentTicketSignal.set(null);
    this.errorSignal.set('');
  }
}
