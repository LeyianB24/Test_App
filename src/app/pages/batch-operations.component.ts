import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ExportService } from '../services/export.service';
import { NotificationService } from '../services/notification.service';

export interface BatchJob {
  id: number;
  jobName: string;
  jobType: 'import' | 'export' | 'reconciliation' | 'validation' | 'cleanup';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  startTime?: string;
  endTime?: string;
  createdBy: string;
  fileName?: string;
  error?: string;
}

@Component({
  selector: 'app-batch-operations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="batch-operations-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>⚙️ Batch Operations Manager</h1>
          <p>Manage bulk imports, exports, and data processing</p>
        </div>
        <button class="btn-primary" (click)="toggleNewJobForm()">
          {{ showNewJobForm() ? '✕ Close' : '+ New Batch Job' }}
        </button>
      </div>

      <!-- New Job Form -->
      <div *ngIf="showNewJobForm()" class="new-job-form-section">
        <h2>Create New Batch Job</h2>

        <div class="form-group">
          <label>Job Type</label>
          <select [(ngModel)]="selectedJobType" class="form-control">
            <option value="">Select Job Type</option>
            <option value="import">Data Import</option>
            <option value="export">Data Export</option>
            <option value="reconciliation">Account Reconciliation</option>
            <option value="validation">Data Validation</option>
            <option value="cleanup">Data Cleanup</option>
          </select>
        </div>

        <div class="form-group" *ngIf="selectedJobType === 'import'">
          <label>Import File</label>
          <input type="file" accept=".csv,.xlsx,.json" class="form-control"
                 (change)="onFileSelected($event)">
          <small>Supported formats: CSV, XLSX, JSON</small>
        </div>

        <div class="form-group" *ngIf="selectedJobType === 'export'">
          <label>Export Data Type</label>
          <select [(ngModel)]="exportDataType" class="form-control">
            <option value="">Select Data Type</option>
            <option value="payments">Payments</option>
            <option value="returns">Tax Returns</option>
            <option value="invoices">Invoices</option>
            <option value="taxpayers">Taxpayers</option>
            <option value="all">All Data</option>
          </select>
        </div>

        <div class="form-group" *ngIf="selectedJobType === 'export'">
          <label>Export Format</label>
          <select [(ngModel)]="exportFormat" class="form-control">
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (XLSX)</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <div class="form-group" *ngIf="selectedJobType === 'reconciliation'">
          <label>Reconciliation Type</label>
          <select [(ngModel)]="reconciliationType" class="form-control">
            <option value="">Select Type</option>
            <option value="payments">Payments Reconciliation</option>
            <option value="invoices">Invoices Reconciliation</option>
            <option value="returns">Returns Reconciliation</option>
            <option value="fund_flow">Fund Flow Analysis</option>
          </select>
        </div>

        <div class="form-actions">
          <button class="btn-primary" (click)="createBatchJob()">
            🚀 Start Batch Job
          </button>
          <button class="btn-secondary" (click)="toggleNewJobForm()">
            Cancel
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-row">
        <div class="stat-box">
          <span class="label">Active Jobs</span>
          <span class="value">{{ activeJobs() }}</span>
        </div>
        <div class="stat-box">
          <span class="label">Completed Today</span>
          <span class="value">{{ completedToday() }}</span>
        </div>
        <div class="stat-box">
          <span class="label">Total Records Processed</span>
          <span class="value">{{ totalProcessed() | number }}</span>
        </div>
        <div class="stat-box">
          <span class="label">Avg Success Rate</span>
          <span class="value">{{ avgSuccessRate() }}%</span>
        </div>
      </div>

      <!-- Active Jobs Section -->
      <div *ngIf="activeJobsList().length > 0" class="jobs-section">
        <h2>🔄 Active & Running Jobs</h2>
        <div class="jobs-grid">
          <div *ngFor="let job of activeJobsList()"
               class="job-card" [ngClass]="'status-' + job.status">
            <div class="job-header">
              <h3>{{ job.jobName }}</h3>
              <span [ngClass]="'badge-' + job.status">{{ job.status | uppercase }}</span>
            </div>

            <div class="job-type">
              {{ getJobTypeLabel(job.jobType) }}
            </div>

            <div class="job-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="job.progress"></div>
              </div>
              <span class="progress-text">{{ job.progress }}%</span>
            </div>

            <div class="job-stats">
              <div class="stat">
                <span class="label">Total Records:</span>
                <span class="value">{{ job.totalRecords }}</span>
              </div>
              <div class="stat">
                <span class="label">Processed:</span>
                <span class="value success">{{ job.processedRecords }}</span>
              </div>
              <div class="stat">
                <span class="label">Failed:</span>
                <span class="value error">{{ job.failedRecords }}</span>
              </div>
            </div>

            <div class="job-actions">
              <button class="action-btn" (click)="pauseJob(job)" *ngIf="job.status === 'running'">
                ⏸️ Pause
              </button>
              <button class="action-btn" (click)="resumeJob(job)" *ngIf="job.status === 'pending'">
                ▶️ Resume
              </button>
              <button class="action-btn" (click)="viewJobDetails(job)">
                👁️ View Details
              </button>
              <button class="action-btn" (click)="cancelJob(job)">
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Completed Jobs Section -->
      <div class="jobs-section">
        <h2>✅ Completed Jobs</h2>
        <div class="filter-controls">
          <input type="search" placeholder="Search job name..."
                 [(ngModel)]="jobSearchTerm" class="search-input">
          <select [(ngModel)]="jobTypeFilter" class="filter-select">
            <option value="">All Types</option>
            <option value="import">Import</option>
            <option value="export">Export</option>
            <option value="reconciliation">Reconciliation</option>
            <option value="validation">Validation</option>
            <option value="cleanup">Cleanup</option>
          </select>
        </div>

        <table class="jobs-table">
          <thead>
            <tr>
              <th>Job Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Records</th>
              <th>Success Rate</th>
              <th>Duration</th>
              <th>Completed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let job of filteredCompletedJobs()" [ngClass]="'status-' + job.status">
              <td class="job-name">{{ job.jobName }}</td>
              <td>{{ getJobTypeLabel(job.jobType) }}</td>
              <td>
                <span [ngClass]="'badge-' + job.status">{{ job.status | uppercase }}</span>
              </td>
              <td>
                <span class="record-count">
                  {{ job.processedRecords }}/{{ job.totalRecords }}
                </span>
              </td>
              <td>
                <span [ngClass]="'rate-' + getSuccessRateClass(job)">
                  {{ getSuccessRate(job) }}%
                </span>
              </td>
              <td>{{ getJobDuration(job) }}</td>
              <td>{{ job.endTime | date: 'short' }}</td>
              <td>
                <div class="action-buttons">
                  <button class="action-icon" (click)="viewJobDetails(job)" title="View Details">
                    👁️
                  </button>
                  <button *ngIf="job.fileName" class="action-icon"
                          (click)="downloadJobResult(job)" title="Download Result">
                    📥
                  </button>
                  <button class="action-icon" (click)="rerunJob(job)" title="Run Again">
                    🔄
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredCompletedJobs().length === 0" class="no-data">
          No completed jobs matching filters
        </div>
      </div>

      <!-- Job Details Modal -->
      <div *ngIf="selectedJob()" class="modal-overlay" (click)="selectedJob.set(null)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Batch Job Details</h2>
            <button class="modal-close" (click)="selectedJob.set(null)">✕</button>
          </div>

          <div class="detail-section">
            <h3>Overview</h3>
            <div class="detail-grid">
              <div class="detail-row">
                <span class="label">Job ID</span>
                <span class="value mono">{{ selectedJob()?.id }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Job Name</span>
                <span class="value">{{ selectedJob()?.jobName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Job Type</span>
                <span class="value">{{ getJobTypeLabel(selectedJob()!.jobType) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status</span>
                <span [ngClass]="'badge-' + (selectedJob()!.status || '')">
                  {{ selectedJob()?.status | uppercase }}
                </span>
              </div>
              <div class="detail-row">
                <span class="label">Created By</span>
                <span class="value">{{ selectedJob()?.createdBy }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>Progress & Statistics</h3>
            <div class="progress-section">
              <div class="progress-bar-large">
                <div class="progress-fill" [style.width.%]="selectedJob()!.progress"></div>
              </div>
              <span class="progress-percentage">{{ selectedJob()?.progress }}% Complete</span>
            </div>

            <div class="stats-grid">
              <div class="stat">
                <span class="label">Total Records</span>
                <span class="value">{{ selectedJob()?.totalRecords }}</span>
              </div>
              <div class="stat">
                <span class="label">Processed</span>
                <span class="value success">{{ selectedJob()?.processedRecords }}</span>
              </div>
              <div class="stat">
                <span class="label">Failed</span>
                <span class="value error">{{ selectedJob()?.failedRecords }}</span>
              </div>
              <div class="stat">
                <span class="label">Success Rate</span>
                <span class="value">{{ getSuccessRate(selectedJob()!) }}%</span>
              </div>
            </div>
          </div>

          <div class="detail-section" *ngIf="selectedJob()?.startTime">
            <h3>Timeline</h3>
            <div class="detail-grid">
              <div class="detail-row">
                <span class="label">Started</span>
                <span class="value">{{ selectedJob()?.startTime | date: 'medium' }}</span>
              </div>
              <div class="detail-row" *ngIf="selectedJob()?.endTime">
                <span class="label">Completed</span>
                <span class="value">{{ selectedJob()?.endTime | date: 'medium' }}</span>
              </div>
              <div class="detail-row" *ngIf="selectedJob()?.endTime">
                <span class="label">Duration</span>
                <span class="value">{{ getJobDuration(selectedJob()!) }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section" *ngIf="selectedJob()?.error">
            <h3>Error Information</h3>
            <div class="error-box">
              {{ selectedJob()?.error }}
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-secondary" (click)="downloadJobReport()" *ngIf="selectedJob()?.status === 'completed'">
              📊 Download Report
            </button>
            <button class="btn-secondary" (click)="retryFailedRecords()" *ngIf="selectedJob()?.failedRecords! > 0">
              🔄 Retry Failed
            </button>
            <button class="btn-secondary" (click)="selectedJob.set(null)">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Footer with quick actions -->
      <div class="batch-footer">
        <div class="quick-exports">
          <h3>Quick Exports</h3>
          <button class="quick-btn" (click)="quickExport('payments')">
            💳 Payments (Excel)
          </button>
          <button class="quick-btn" (click)="quickExport('returns')">
            📋 Returns (CSV)
          </button>
          <button class="quick-btn" (click)="quickExport('invoices')">
            🧾 Invoices (Excel)
          </button>
        </div>

        <div class="batch-status">
          <div class="status-item">
            <span>Jobs in Last 24h:</span>
            <strong>{{ jobsLast24h() }}</strong>
          </div>
          <div class="status-item">
            <span>Avg Job Duration:</span>
            <strong>{{ avgJobDuration() }}</strong>
          </div>
          <div class="status-item">
            <span>Total Records Imported:</span>
            <strong>{{ totalImported() | number }}</strong>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .batch-operations-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .page-header h1 {
      margin: 0;
      color: #333;
    }

    .page-header p {
      margin: 0.5rem 0 0 0;
      color: #666;
    }

    .btn-primary {
      padding: 0.75rem 1.5rem;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      background: #218838;
      transform: translateY(-2px);
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .new-job-form-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      border: 2px solid #28a745;
    }

    .new-job-form-section h2 {
      margin-top: 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-control,
    .form-group input[type="file"] {
      padding: 0.75rem;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 0.95rem;
    }

    .form-control:focus,
    .form-group input[type="file"]:focus {
      outline: none;
      border-color: #28a745;
      box-shadow: 0 0 0 3px rgba(40,167,69,0.1);
    }

    .form-group small {
      color: #999;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-box {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      border-left: 4px solid #28a745;
    }

    .stat-box .label {
      color: #666;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .stat-box .value {
      font-size: 1.8rem;
      font-weight: bold;
      color: #28a745;
    }

    .jobs-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .jobs-section h2 {
      margin-top: 0;
      color: #333;
    }

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .job-card {
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .job-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .job-card.status-running {
      border-color: #007bff;
      background: #f0f7ff;
    }

    .job-card.status-pending {
      border-color: #ffc107;
      background: #fffbf0;
    }

    .job-card.status-completed {
      border-color: #28a745;
      background: #f1f9f1;
    }

    .job-card.status-failed {
      border-color: #dc3545;
      background: #fff1f1;
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .job-header h3 {
      margin: 0;
      color: #333;
    }

    .badge-running {
      background: #007bff;
      color: white;
    }

    .badge-pending {
      background: #ffc107;
      color: #333;
    }

    .badge-completed {
      background: #28a745;
      color: white;
    }

    .badge-failed {
      background: #dc3545;
      color: white;
    }

    .badge-running,
    .badge-pending,
    .badge-completed,
    .badge-failed {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .job-type {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .job-progress {
      margin-bottom: 1rem;
    }

    .progress-bar {
      height: 12px;
      background: #e9ecef;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #28a745, #20c997);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.85rem;
      font-weight: 600;
      color: #666;
    }

    .job-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .job-stats .stat {
      display: flex;
      flex-direction: column;
    }

    .job-stats .label {
      font-size: 0.75rem;
      color: #999;
      font-weight: 600;
    }

    .job-stats .value {
      font-size: 1rem;
      font-weight: bold;
      color: #333;
    }

    .job-stats .value.success {
      color: #28a745;
    }

    .job-stats .value.error {
      color: #dc3545;
    }

    .job-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .action-btn {
      flex: 1;
      padding: 0.5rem;
      background: #f0f0f0;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: #e0e0e0;
      transform: scale(1.05);
    }

    .filter-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .search-input,
    .filter-select {
      padding: 0.75rem;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 0.95rem;
    }

    .search-input {
      flex: 1;
    }

    .search-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #28a745;
      box-shadow: 0 0 0 3px rgba(40,167,69,0.1);
    }

    .jobs-table {
      width: 100%;
      border-collapse: collapse;
    }

    .jobs-table thead {
      background: #f8f9fa;
    }

    .jobs-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #dee2e6;
    }

    .jobs-table td {
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
      color: #333;
    }

    .jobs-table tr:hover {
      background: #f8f9fa;
    }

    .jobs-table tr.status-failed {
      background: #fff5f5;
    }

    .job-name {
      font-weight: 600;
    }

    .record-count {
      background: #f0f0f0;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .rate-high {
      color: #28a745;
      font-weight: 600;
    }

    .rate-medium {
      color: #ffc107;
      font-weight: 600;
    }

    .rate-low {
      color: #dc3545;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .action-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      transition: transform 0.2s ease;
    }

    .action-icon:hover {
      transform: scale(1.2);
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #999;
      font-weight: 500;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 700px;
      width: 90%;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 2px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    .detail-section {
      padding: 1.5rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .detail-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .detail-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .detail-row {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 1rem;
    }

    .detail-row .label {
      font-weight: 600;
      color: #666;
    }

    .detail-row .value {
      color: #333;
    }

    .mono {
      font-family: monospace;
    }

    .progress-section {
      margin-bottom: 1.5rem;
    }

    .progress-bar-large {
      height: 24px;
      background: #e9ecef;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .progress-bar-large .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #28a745, #20c997);
    }

    .progress-percentage {
      font-weight: 600;
      color: #666;
      font-size: 0.95rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .stats-grid .stat {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .stats-grid .label {
      display: block;
      font-size: 0.85rem;
      color: #666;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .stats-grid .value {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      color: #28a745;
    }

    .stats-grid .value.error {
      color: #dc3545;
    }

    .stats-grid .value.success {
      color: #28a745;
    }

    .error-box {
      background: #fff5f5;
      border-left: 4px solid #dc3545;
      padding: 1rem;
      border-radius: 4px;
      color: #842029;
      font-family: monospace;
      font-size: 0.9rem;
    }

    .modal-actions {
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      border-top: 1px solid #f0f0f0;
      flex-wrap: wrap;
    }

    .batch-footer {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .quick-exports h3,
    .batch-status h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .quick-btn {
      display: block;
      width: 100%;
      padding: 0.75rem;
      background: #f0f0f0;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      margin-bottom: 0.75rem;
      transition: all 0.2s ease;
    }

    .quick-btn:hover {
      background: #28a745;
      color: white;
      border-color: #28a745;
    }

    .batch-status {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: center;
    }

    .status-item {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .status-item span {
      color: #666;
    }

    .status-item strong {
      color: #28a745;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .batch-operations-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
      }

      .jobs-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .batch-footer {
        grid-template-columns: 1fr;
      }

      .filter-controls {
        flex-direction: column;
      }

      .search-input {
        width: 100%;
      }
    }
  `]
})
export class BatchOperationsComponent implements OnInit {
  private apiService = inject(ApiService);
  private exportService = inject(ExportService);
  private notificationService = inject(NotificationService);

  jobs = signal<BatchJob[]>([]);
  selectedJob = signal<BatchJob | null>(null);
  showNewJobForm = signal(false);

  selectedJobType = '';
  selectedFile: File | null = null;
  exportDataType = '';
  exportFormat = 'csv';
  reconciliationType = '';
  jobSearchTerm = '';
  jobTypeFilter = '';

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.apiService.get<any>('batch_operations_api.php', { params: { action: 'list' } }).subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.jobs) {
          this.jobs.set(response.data.jobs || []);
        } else if (response.data && Array.isArray(response.data)) {
          this.jobs.set(response.data);
        } else {
          this.jobs.set([]);
        }
      },
      error: (error) => {
        console.error('Error loading batch jobs:', error);
        this.notificationService.showError('Failed to load batch jobs');
        this.jobs.set([]);
      }
    });
  }

  activeJobsList = computed(() =>
    this.jobs().filter(j => j.status === 'running' || j.status === 'pending')
  );

  filteredCompletedJobs = computed(() => {
    let filtered = this.jobs().filter(j => j.status === 'completed' || j.status === 'failed');

    if (this.jobSearchTerm) {
      filtered = filtered.filter(j =>
        j.jobName.toLowerCase().includes(this.jobSearchTerm.toLowerCase())
      );
    }

    if (this.jobTypeFilter) {
      filtered = filtered.filter(j => j.jobType === this.jobTypeFilter);
    }

    return filtered;
  });

  activeJobs = computed(() => this.activeJobsList().length);

  completedToday = computed(() => {
    const today = new Date().toDateString();
    return this.jobs().filter(j =>
      j.status === 'completed' &&
      new Date(j.endTime || '').toDateString() === today
    ).length;
  });

  totalProcessed = computed(() =>
    this.jobs().reduce((sum, j) => sum + j.processedRecords, 0)
  );

  avgSuccessRate = computed(() => {
    const completed = this.filteredCompletedJobs();
    if (completed.length === 0) return 0;
    const avgRate = completed.reduce((sum, j) => sum + this.getSuccessRate(j), 0) / completed.length;
    return Math.round(avgRate);
  });

  jobsLast24h = computed(() => {
    const oneDayAgo = new Date(Date.now() - 86400000);
    return this.jobs().filter(j => new Date(j.startTime || '') > oneDayAgo).length;
  });

  avgJobDuration = computed(() => {
    const completed = this.jobs().filter(j => j.endTime && j.startTime);
    if (completed.length === 0) return '0m';
    const totalMs = completed.reduce((sum, j) => {
      const start = new Date(j.startTime!).getTime();
      const end = new Date(j.endTime!).getTime();
      return sum + (end - start);
    }, 0);
    const avgMs = totalMs / completed.length;
    const minutes = Math.round(avgMs / 60000);
    return `${minutes}m`;
  });

  totalImported = computed(() =>
    this.jobs()
      .filter(j => j.jobType === 'import' && j.status === 'completed')
      .reduce((sum, j) => sum + j.processedRecords, 0)
  );

  toggleNewJobForm() {
    this.showNewJobForm.set(!this.showNewJobForm());
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createBatchJob() {
    const jobName = this.selectedJobType.charAt(0).toUpperCase() + this.selectedJobType.slice(1);
    const newJob = {
      jobName: `${jobName} - ${new Date().toLocaleDateString()}`,
      jobType: this.selectedJobType,
      fileName: this.selectedFile?.name
    };

    this.apiService.post<any>('batch_operations_api.php', newJob).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Batch job created successfully');
          this.loadJobs();
          this.showNewJobForm.set(false);
          this.selectedJobType = '';
          this.selectedFile = null;
        } else {
          this.notificationService.showError(response.error || 'Failed to create batch job');
        }
      },
      error: (error) => {
        console.error('Error creating batch job:', error);
        this.notificationService.showError('Failed to create batch job');
      }
    });
  }

  pauseJob(job: BatchJob) {
    job.status = 'pending';
    this.jobs.set([...this.jobs()]);
    this.notificationService.showSuccess('Job paused');
  }

  resumeJob(job: BatchJob) {
    job.status = 'running';
    this.jobs.set([...this.jobs()]);
    this.notificationService.showSuccess('Job resumed');
  }

  cancelJob(job: BatchJob) {
    job.status = 'failed';
    job.error = 'Job cancelled by user';
    this.jobs.set([...this.jobs()]);
    this.notificationService.showSuccess('Job cancelled');
  }

  viewJobDetails(job: BatchJob) {
    this.selectedJob.set(job);
  }

  downloadJobResult(job: BatchJob) {
    this.notificationService.showSuccess('Download started');
  }

  rerunJob(job: BatchJob) {
    const newJob = { ...job, id: Math.max(...this.jobs().map(j => j.id), 0) + 1, status: 'running' as const, progress: 0, processedRecords: 0, startTime: new Date().toISOString(), endTime: undefined };
    this.jobs.set([newJob, ...this.jobs()]);
    this.notificationService.showSuccess('Job restarted');
  }

  downloadJobReport() {
    this.notificationService.showSuccess('Report downloaded');
  }

  retryFailedRecords() {
    this.notificationService.showSuccess('Retrying failed records...');
  }

  quickExport(type: string) {
    this.notificationService.showSuccess(`Exporting ${type}...`);
  }

  getJobTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      import: '📥 Data Import',
      export: '📤 Data Export',
      reconciliation: '🔄 Reconciliation',
      validation: '✓ Validation',
      cleanup: '🧹 Cleanup'
    };
    return labels[type] || type;
  }

  getSuccessRate(job: BatchJob): number {
    if (job.totalRecords === 0) return 0;
    return Math.round(((job.processedRecords - job.failedRecords) / job.totalRecords) * 100);
  }

  getSuccessRateClass(job: BatchJob): string {
    const rate = this.getSuccessRate(job);
    if (rate >= 95) return 'high';
    if (rate >= 80) return 'medium';
    return 'low';
  }

  getJobDuration(job: BatchJob): string {
    if (!job.startTime || !job.endTime) return 'N/A';
    const start = new Date(job.startTime).getTime();
    const end = new Date(job.endTime).getTime();
    const seconds = Math.floor((end - start) / 1000);
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  }
}
