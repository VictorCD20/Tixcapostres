import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sales',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="display: flex; min-height: 100vh; background: #f8f9fa;">
      <aside style="width: 260px; background: var(--secondary); color: white; padding: 2rem;">
        <h2 class="brand-font" style="font-size: 2rem; margin-bottom: 3rem; color: var(--primary);">Admin Tixca</h2>
        <nav style="display: grid; gap: 1rem;">
          <a routerLink="/admin" class="nav-link">Dashboard</a>
          <a routerLink="/admin/pedidos" class="nav-link">Pedidos</a>
          <a routerLink="/admin/productos" class="nav-link">Productos</a>
          <a routerLink="/admin/inventario" class="nav-link">Inventario</a>
          <a routerLink="/admin/ventas" class="nav-link active">Ventas</a>
          <a routerLink="/" class="nav-link" style="margin-top: 5rem; opacity: 0.6;">Volver</a>
        </nav>
      </aside>

      <main style="flex: 1; padding: 3rem;">
        <h1 style="font-size: 2.5rem; margin-bottom: 2rem;">Reporte de Ventas</h1>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem;">
          <div class="premium-card">
            <h3>Ingresos Históricos</h3>
            <p style="font-size: 2.5rem; font-weight: 700; color: var(--secondary);">\${{totalRevenue}}</p>
          </div>
          <div class="premium-card">
            <h3>Pedidos Completados</h3>
            <p style="font-size: 2.5rem; font-weight: 700; color: var(--primary-dark);">{{completedOrders}}</p>
          </div>
        </div>

        <div class="premium-card">
          <h3 style="margin-bottom: 1.5rem;">Historial Detallado</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #f0f0f0;">
                <th style="padding: 1rem;">Fecha</th>
                <th style="padding: 1rem;">ID Pedido</th>
                <th style="padding: 1rem;">Total</th>
                <th style="padding: 1rem;">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of sales" style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 1rem;">{{s.created_at | date:'medium'}}</td>
                <td style="padding: 1rem;">#{{s.id.substring(0,8)}}</td>
                <td style="padding: 1rem; font-weight: 600;">\${{s.total}}</td>
                <td style="padding: 1rem;">
                  <span style="font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 10px; background: #eee;">{{s.estado}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .nav-link { color: rgba(255,255,255,0.7); text-decoration: none; padding: 0.8rem 1rem; border-radius: 10px; }
    .nav-link.active { background: rgba(255,255,255,0.1); color: white; }
  `]
})
export class AdminSalesComponent implements OnInit {
  supabase = inject(SupabaseService);
  sales: any[] = [];
  totalRevenue = 0;
  completedOrders = 0;

  async ngOnInit() {
    const { data } = await this.supabase.client
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });
    
    this.sales = data || [];
    this.totalRevenue = this.sales.reduce((acc, s) => acc + (Number(s.total) || 0), 0);
    this.completedOrders = this.sales.filter(s => s.estado === 'entregado' || s.estado === 'pagado').length;
  }
}
