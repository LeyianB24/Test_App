import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
  title?: string;
  columns: ExportColumn[];
  pageSize?: 'A4' | 'A3' | 'LETTER';
  orientation?: 'portrait' | 'landscape';
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private notificationService: NotificationService) {}

  /**
   * Export data to Excel/CSV format
   */
  exportToExcel(data: any[], options: ExportOptions): void {
    try {
      const filename = options.filename || 'export.csv';
      const csv = this.convertToCSV(data, options.columns);
      this.downloadFile(csv, filename, 'text/csv;charset=utf-8;');
      this.notificationService.showSuccess(`Data exported to ${filename}`);
    } catch (error: any) {
      this.notificationService.showError(`Failed to export to Excel: ${error.message}`);
    }
  }

  /**
   * Export data to PDF format
   */
  exportToPDF(data: any[], options: ExportOptions): void {
    try {
      const filename = options.filename || 'export.pdf';
      const html = this.convertToHTML(data, options);

      // Using a simple table-to-PDF approach with print styling
      const printWindow = window.open('', '', 'width=900,height=600');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      printWindow.document.write(html);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
        // Note: File naming in save dialog happens when user saves via browser
        this.notificationService.showSuccess(`PDF ready to save as ${filename}`);
      }, 250);
    } catch (error: any) {
      this.notificationService.showError(`Failed to export to PDF: ${error.message}`);
    }
  }

  /**
   * Export data to JSON format
   */
  exportToJSON(data: any[], options: ExportOptions): void {
    try {
      const filename = options.filename || 'export.json';
      const json = JSON.stringify(data, null, 2);
      this.downloadFile(json, filename, 'application/json;charset=utf-8;');
      this.notificationService.showSuccess(`Data exported to ${filename}`);
    } catch (error: any) {
      this.notificationService.showError(`Failed to export to JSON: ${error.message}`);
    }
  }

  /**
   * Convert array to CSV format
   */
  convertToCSV(data: any[], columns: ExportColumn[]): string {
    const headers = columns.map(col => this.escapeCSVValue(col.label)).join(',');

    const rows = data.map(row => {
      return columns.map(col => {
        let value = row[col.key];
        if (col.format) {
          value = col.format(value);
        }
        return this.escapeCSVValue(value);
      }).join(',');
    });

    return [headers, ...rows].join('\n');
  }

  /**
   * Escape CSV values
   */
  private escapeCSVValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);

    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }

  /**
   * Convert array to HTML table
   */
  private convertToHTML(data: any[], options: ExportOptions): string {
    const title = options.title || 'Export';
    const timestamp = new Date().toLocaleString();

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #2c3e50;
          }
          .header p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          thead {
            background-color: #34495e;
            color: white;
          }
          th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #bdc3c7;
          }
          td {
            padding: 10px 12px;
            border: 1px solid #ecf0f1;
          }
          tbody tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          tbody tr:hover {
            background-color: #ecf0f1;
          }
          .footer {
            text-align: right;
            font-size: 11px;
            color: #999;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
          }
          @media print {
            body { margin: 0; }
            .footer { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Exported on ${timestamp}</p>
        </div>
        <table>
          <thead>
            <tr>
              ${options.columns.map(col => `<th>${col.label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${options.columns.map(col => {
                  let value = row[col.key];
                  if (col.format) {
                    value = col.format(value);
                  }
                  return `<td>${this.escapeHTML(value)}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Total records: ${data.length}</p>
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Escape HTML special characters
   */
  private escapeHTML(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const string = String(value);
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }

  /**
   * Download file helper
   */
  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate report with summary statistics
   */
  generateReport(data: any[], options: {
    columns: ExportColumn[];
    title: string;
    summary?: Record<string, any>;
    groupBy?: string;
  }): string {
    // Group data if needed
    let groupedData: Record<string, any[]> = {};
    if (options.groupBy) {
      data.forEach(item => {
        const key = item[options.groupBy!];
        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push(item);
      });
    } else {
      groupedData['All'] = data;
    }

    // Generate HTML report
    const timestamp = new Date().toLocaleString();
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${options.title} Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            background: #f5f5f5;
          }
          .report-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .report-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 20px;
          }
          .report-header h1 {
            font-size: 28px;
            color: #2c3e50;
            margin-bottom: 10px;
          }
          .report-meta {
            font-size: 12px;
            color: #666;
          }
          .summary-section {
            background: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .summary-item {
            display: inline-block;
            margin-right: 30px;
            margin-bottom: 10px;
          }
          .summary-item-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
          }
          .summary-item-value {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
          }
          .group-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .group-title {
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #3498db;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          thead {
            background: #34495e;
            color: white;
          }
          th {
            padding: 10px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 8px 10px;
            border-bottom: 1px solid #ecf0f1;
          }
          tbody tr:hover {
            background: #f8f9fa;
          }
          @media print {
            body { background: white; }
            .report-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <h1>${options.title}</h1>
            <div class="report-meta">
              <p>Generated: ${timestamp}</p>
            </div>
          </div>
    `;

    // Add summary if provided
    if (options.summary && Object.keys(options.summary).length > 0) {
      html += '<div class="summary-section">';
      Object.keys(options.summary).forEach(key => {
        html += `
          <div class="summary-item">
            <div class="summary-item-label">${key}</div>
            <div class="summary-item-value">${options.summary![key]}</div>
          </div>
        `;
      });
      html += '</div>';
    }

    // Add grouped data tables
    Object.keys(groupedData).forEach(group => {
      const groupItems = groupedData[group];
      html += `
        <div class="group-section">
          <div class="group-title">${group} (${groupItems.length} records)</div>
          <table>
            <thead>
              <tr>
                ${options.columns.map(col => `<th>${col.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${groupItems.map(item => `
                <tr>
                  ${options.columns.map(col => {
                    let value = item[col.key];
                    if (col.format) {
                      value = col.format(value);
                    }
                    return `<td>${this.escapeHTML(value)}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    });

    html += `
        </div>
      </body>
      </html>
    `;

    return html;
  }
}
