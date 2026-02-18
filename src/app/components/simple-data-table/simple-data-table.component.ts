import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="simple-table">
      <h3>{{title()}}</h3>
      <table>
        <thead>
          <tr>
            <th *ngFor="let col of columns()">{{col}}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of data()">
            <td *ngFor="let col of columns()">{{item[col]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .simple-table { background: white; padding: 20px; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f9fa; font-weight: 600; }
  `]
})
export class SimpleDataTableComponent {
  data = input<any[]>([]);
  columns = input<string[]>([]);
  title = input<string>('');
}
