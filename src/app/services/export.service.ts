import { inject, Injectable } from '@angular/core';
import { NotificationService } from '../core/services/notification.service';

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: unknown) => string;
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

  // TODO: Check constructor replacements
  private notificationService = inject(NotificationService);
  constructor() {}

  /**
   * Export data to Excel/CSV format
   */
  exportToExcel(data: unknown[], options: ExportOptions): void {
    try {
      const filename = options.filename || 'export.csv';
      const csv = this.convertToCSV(data, options.columns);
      this.downloadFile(csv, filename, 'text/csv;charset=utf-8;');
      this.notificationService.showSuccess(`Data exported to ${filename}`);
    } catch (error: unknown) {
      this.notificationService.showError(`Failed to export to Excel: ${(error as Error).message}`);
    }
  }

  /**
   * Export data to PDF format using KRA-branded print window
   */
  exportToPDF(data: unknown[], options: ExportOptions): void {
    try {
      const filename = options.filename || 'export.pdf';
      const html = this.convertToHTML(data, options);

      const printWindow = window.open('', '', 'width=900,height=700');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      // Write HTML
      printWindow.document.write(html);
      
      // Inject script to ensure images finish loading before the print prompt freezes the viewport
      printWindow.document.write(`
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      `);
      printWindow.document.close();
      
      this.notificationService.showSuccess(`PDF ready to save as ${filename}`);
    } catch (error: unknown) {
      this.notificationService.showError(`Failed to export to PDF: ${(error as Error).message}`);
    }
  }

  /**
   * Export data to JSON format
   */
  exportToJSON(data: unknown[], options: ExportOptions): void {
    try {
      const filename = options.filename || 'export.json';
      const json = JSON.stringify(data, null, 2);
      this.downloadFile(json, filename, 'application/json;charset=utf-8;');
      this.notificationService.showSuccess(`Data exported to ${filename}`);
    } catch (error: unknown) {
      this.notificationService.showError(`Failed to export to JSON: ${(error as Error).message}`);
    }
  }

  /**
   * Convert array to CSV format
   */
  convertToCSV(data: unknown[], columns: ExportColumn[]): string {
    const headers = columns.map(col => this.escapeCSVValue(col.label)).join(',');

    const rows = (data as Record<string, unknown>[]).map(row => {
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
  private escapeCSVValue(value: unknown): string {
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
   * Convert array to KRA-branded HTML table for printing.
   * Mirrors the layout of the server-side PdfTemplate.php:
   *   - Black/red hourglass wedges on the left
   *   - KRA logo centered at the top
   *   - Contact info top-right
   *   - Footer: iTax logo left, "Tulipe Ushuru" tagline center, Vision 2030 right
   */
  private convertToHTML(data: unknown[], options: ExportOptions): string {
    const title = options.title || 'Export';
    const timestamp = new Date().toLocaleDateString('en-GB');

    const tableRows = (data as Record<string, unknown>[]).map(row => `
      <tr>
        ${options.columns.map(col => {
          let value = row[col.key];
          if (col.format) value = col.format(value);
          const safe = String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          return `<td>${safe}</td>`;
        }).join('')}
      </tr>`).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 8.5pt; line-height: 1.3; color: #000; background: #fff; }

    /* Hourglass branding bar — mirrors PHP template */
    #branding-bar {
      position: fixed; top: 0; left: 0; width: 28px; height: 100vh;
      overflow: hidden; z-index: 0; display: flex; flex-direction: column;
    }
    #branding-bar svg { display: block; flex: 1; width: 28px; }

    /* Main content offset */
    #content { margin-left: 38px; padding: 12px 24px 12px 8px; }

    /* Header */
    .cert-header {
      margin-bottom: 12px;
    }
    
    /* Contact info */
    .contact-hdr { font-size: 7.5pt; font-weight: bold; line-height: 1.2; }
    .contact-line { font-size: 7.5pt; line-height: 1.2; }

    /* Data table */
    .data-table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 10px; table-layout: fixed; word-wrap: break-word; }
    .data-table th, .data-table td { border: 1.2pt solid #000; padding: 4px 5px; font-size: 8.5pt; }
    .data-table th { font-weight: bold; background: #E5E7EB; text-align: left; }
    .data-table td { background: #fff; }

    /* Footer */
    .cert-footer { border-top: 1px solid #000; padding-top: 8px; margin-top: 15px; text-align: center; }
    .tagline { font-size: 10pt; font-weight: bold; font-style: italic; color: #cc0000; margin-bottom: 8px; }
    .footer-disc { font-size: 7pt; color: #666; font-style: italic; margin-top: 6px; text-align: left; }
    .report-meta { font-size: 7.5pt; color: #444; text-align: right; margin-top: 4px; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      #branding-bar { position: fixed; }
    }
  </style>
</head>
<body>
  <!-- Hourglass branding bar: black top-half, red bottom-half -->
  <div id="branding-bar">
    <svg viewBox="0 0 28 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 28,0 0,500" fill="#000000"/>
    </svg>
    <svg viewBox="0 0 28 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,500 28,500 0,0" fill="#cc0000"/>
    </svg>
  </div>

  <div id="content">
    <!-- Header: Responsive Float Layout -->
    <div class="cert-header">
      <!-- Top row: Logo, Badge, Contacts -->
      <div style="width: 100%; overflow: hidden; padding-bottom: 5px;">
        <!-- Left: Logo & URL -->
        <div style="float: left; width: 33%;">
           <img src="${origin}/assets/logo.png" style="width: 160px; height: auto;" alt="KRA Logo"><br>
           <div style="font-size: 10pt; font-weight: bold; border-bottom: 3.5px solid #000; display: inline-block; margin-top: 10px; padding-bottom: 2px;">www.kra.go.ke</div>
        </div>
        
        <!-- Center: Badge -->
        <div style="float: left; width: 34%; text-align: center;">
           <div style="background: #E5E7EB; padding: 15px 5px; width: 100%; max-width: 220px; margin: 0 auto; font-size: 15pt; font-weight: bold; color: #333;">
             ${title}
           </div>
        </div>

        <!-- Right: Contact Info -->
        <div style="float: right; width: 33%; text-align: right; font-size: 8.5pt; line-height: 1.2;">
           <b>For General Tax Questions<br>Contact KRA Call Centre</b><br>
           Tel: +254 (020) 4999 999<br>
           Cell: +254(0711)099 999<br>
           Email: callcentre@kra.go.ke
        </div>
      </div>

      <!-- Metadata row: Sandwiched between lines -->
      <div style="border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 4px 0; margin-top: 5px; text-align: right; font-size: 10pt;">
          <b>Certificate Date :</b> <span style="margin-right: 20px;">${timestamp.split(' ')[0]}</span>
          <b>Personal Identification Number :</b> <span style="font-weight: bold; font-size: 11pt;">P749462692W</span>
      </div>
    </div>

    <!-- Data table -->
    <table class="data-table">
      <thead>
        <tr>${options.columns.map(col => `<th>${col.label}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>

    <!-- Footer: Responsive Float Layout -->
    <div class="cert-footer">
      <!-- Tagline above line -->
      <div style="text-align: center; color: #cc0000; font-weight: bold; font-style: italic; font-size: 12pt; margin-bottom: 5px;">
        Tulipe Ushuru, Tujitegemee!
      </div>
      
      <!-- Separation Line -->
      <div style="border-top: 1px solid #000; margin-bottom: 8px;"></div>
      
      <!-- Logos Row -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">
        <tr>
          <td style="width: 50%; text-align: left; vertical-align: bottom;">
            <img src="${origin}/assets/itax.jpeg" height="42" style="max-height: 42px; width: auto;" alt="iTax">
          </td>
          <td style="width: 50%; text-align: right; vertical-align: bottom;">
            <img src="${origin}/assets/vision_2030.png" height="42" style="max-height: 42px; width: auto;" alt="Vision 2030">
          </td>
        </tr>
      </table>
      
      <div class="footer-disc">Disclaimer: This is a system generated certificate and does not require signature.</div>
      <div class="report-meta">Generated: ${timestamp} &nbsp;|&nbsp; Total records: ${data.length}</div>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Escape HTML special characters
   */
  private escapeHTML(value: unknown): string {
    if (value === null || value === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(value);
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
   * Generate report with summary statistics (used in some admin views)
   */
  generateReport(data: unknown[], options: {
    columns: ExportColumn[];
    title: string;
    summary?: Record<string, unknown>;
    groupBy?: string;
  }): string {
    const groupedData: Record<string, unknown[]> = {};
    if (options.groupBy) {
      (data as Record<string, unknown>[]).forEach(item => {
        const key = String(item[options.groupBy!]);
        if (!groupedData[key]) groupedData[key] = [];
        groupedData[key].push(item);
      });
    } else {
      groupedData['All'] = data;
    }

    const timestamp = new Date().toLocaleString();

    let tablesSections = '';
    Object.keys(groupedData).forEach(group => {
      const groupItems = groupedData[group] as Record<string, unknown>[];
      tablesSections += `
        <div class="group-section">
          <div class="group-title">${group} (${groupItems.length} records)</div>
          <table class="data-table">
            <thead>
              <tr>${options.columns.map(col => `<th>${col.label}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${groupItems.map(item => `
                <tr>
                  ${options.columns.map(col => {
                    let value = item[col.key];
                    if (col.format) value = col.format(value);
                    return `<td>${this.escapeHTML(value)}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>`;
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${options.title} Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #000; background: #fff; }
    #branding-bar { position: fixed; top: 0; left: 0; width: 28px; height: 100vh; overflow: hidden; z-index: 0; display: flex; flex-direction: column; }
    #branding-bar svg { display: block; flex: 1; width: 28px; }
    #content { margin-left: 38px; padding: 16px 28px 16px 8px; }
    .cert-header { text-align: center; border-bottom: 2pt solid #000; padding-bottom: 10pt; margin-bottom: 14pt; position: relative; }
    .kra-logo { height: 65pt; margin-bottom: 4pt; }
    .kra-url { font-size: 8pt; font-weight: bold; border-bottom: 1pt solid #000; display: inline-block; }
    .cert-title-badge { background: #E5E7EB; padding: 5pt 14pt; font-size: 13pt; font-weight: bold; display: inline-block; margin-top: 8pt; }
    .contact-info { position: absolute; top: 0; right: 0; text-align: right; }
    .contact-info div { font-size: 7pt; line-height: 1.4; }
    .contact-bold { font-weight: bold; }
    .summary-section { background: #f0f0f0; padding: 10pt; margin-bottom: 12pt; border-radius: 4pt; }
    .summary-item { display: inline-block; margin-right: 20pt; margin-bottom: 6pt; }
    .summary-label { font-size: 8pt; color: #555; text-transform: uppercase; }
    .summary-value { font-size: 14pt; font-weight: bold; }
    .group-section { margin-bottom: 20pt; page-break-inside: avoid; }
    .group-title { font-size: 11pt; font-weight: bold; margin-bottom: 6pt; padding-bottom: 4pt; border-bottom: 1pt solid #666; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { border: 1pt solid #000; padding: 4pt 6pt; font-size: 8pt; }
    .data-table th { font-weight: bold; background: #E5E7EB; text-align: left; }
    .cert-footer { border-top: 1pt solid #000; padding-top: 8pt; margin-top: 16pt; }
    .tagline { font-size: 10pt; font-weight: bold; font-style: italic; color: #cc0000; text-align: center; margin-bottom: 8pt; }
    .footer-logos { display: flex; justify-content: space-between; align-items: center; }
    .footer-img { height: 28pt; }
    .footer-disc { font-size: 7pt; color: #666; font-style: italic; margin-top: 6pt; }
    .report-meta { font-size: 8pt; color: #444; text-align: right; margin-top: 4pt; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } #branding-bar { position: fixed; } }
  </style>
</head>
<body>
  <div id="branding-bar">
    <svg viewBox="0 0 28 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 28,0 0,500" fill="#000000"/></svg>
    <svg viewBox="0 0 28 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polygon points="0,500 28,500 0,0" fill="#cc0000"/></svg>
  </div>
  <div id="content">
    <div class="cert-header">
      <div class="contact-info">
        <div class="contact-bold">KRA Call Centre</div>
        <div>Tel: +254 (020) 4999 999</div>
        <div>Cell: +254(0711)099 999</div>
        <div>callcentre@kra.go.ke</div>
      </div>
      <img src="http://localhost:4200/assets/logo.png" class="kra-logo" alt="KRA Logo" onerror="this.style.display='none'"><br>
      <span class="kra-url">www.kra.go.ke</span>
      <div><span class="cert-title-badge">${options.title} Report</span></div>
    </div>
    ${options.summary && Object.keys(options.summary).length > 0 ? `
    <div class="summary-section">
      ${Object.keys(options.summary).map(key => `
        <div class="summary-item">
          <div class="summary-label">${key}</div>
          <div class="summary-value">${options.summary![key]}</div>
        </div>`).join('')}
    </div>` : ''}
    ${tablesSections}
    <div class="cert-footer">
      <div class="tagline">Tulipe Ushuru, Tujitegemee!</div>
      <div class="footer-logos">
        <img src="http://localhost:4200/assets/itax.jpeg" class="footer-img" alt="iTax" onerror="this.style.display='none'">
        <img src="http://localhost:4200/assets/vision_2030.png" class="footer-img" alt="Vision 2030" onerror="this.style.display='none'">
      </div>
      <div class="footer-disc">Disclaimer: This is a system generated document and does not require signature.</div>
      <div class="report-meta">Generated: ${timestamp}</div>
    </div>
  </div>
</body>
</html>`;
  }
}
