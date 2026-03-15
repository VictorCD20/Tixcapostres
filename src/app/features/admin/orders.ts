import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div style="display: flex; min-height: 100vh; background: #f8f9fa;">
      <aside style="width: 260px; background: var(--secondary); color: white; padding: 2rem;">
        <h2 class="brand-font" style="font-size: 2rem; margin-bottom: 3rem; color: var(--primary);">Admin Tixca</h2>
        <nav style="display: grid; gap: 1rem;">
          <a routerLink="/admin" class="nav-link">Dashboard</a>
          <a routerLink="/admin/pedidos" class="nav-link active">Pedidos</a>
          <a routerLink="/admin/productos" class="nav-link">Productos</a>
          <a routerLink="/admin/inventario" class="nav-link">Inventario</a>
          <a routerLink="/" class="nav-link" style="margin-top: 5rem; opacity: 0.6;">Volver</a>
        </nav>
      </aside>

      <main style="flex: 1; padding: 3rem;">
        <h1 style="font-size: 2.5rem; margin-bottom: 2rem;">Gestión de Pedidos</h1>

        <div class="premium-card">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #f0f0f0;">
                <th style="padding: 1rem;">ID</th>
                <th style="padding: 1rem;">Cliente</th>
                <th style="padding: 1rem;">Entrega</th>
                <th style="padding: 1rem;">Estado</th>
                <th style="padding: 1rem;">Total</th>
                <th style="padding: 1rem;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders" style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 1rem; font-size: 0.8rem;">#{{order.id.substring(0,8)}}</td>
                <td style="padding: 1rem;">
                  <div style="font-weight: 600;">{{order.direccion_colonia || 'Sin colonia'}}</div>
                  <div style="font-size: 0.8rem; opacity: 0.6;">{{order.direccion_referencias}}</div>
                </td>
                <td style="padding: 1rem; text-transform: capitalize;">{{order.tipo_entrega}}</td>
                <td style="padding: 1rem;">
                  <select [(ngModel)]="order.estado" (change)="updateStatus(order)" 
                          style="padding: 0.4rem; border-radius: 5px; border: 1px solid #ddd;">
                    <option *ngFor="let st of statuses" [value]="st">{{st}}</option>
                  </select>
                </td>
                <td style="padding: 1rem; font-weight: 700;">\${{order.total}}</td>
                <td style="padding: 1rem;">
                  <button (click)="viewDetails(order)" style="border: none; background: none; color: var(--primary-dark); cursor: pointer;">
                    <span class="material-icons">visibility</span>
                  </button>
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
export class AdminOrdersComponent implements OnInit {
  supabase = inject(SupabaseService);
  orders: any[] = [];
  statuses = ['pendiente', 'pagado', 'preparando', 'en_camino', 'entregado', 'cancelado'];

  async ngOnInit() {
    await this.loadOrders();
  }

  async loadOrders() {
    const { data } = await this.supabase.client
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });
    this.orders = data || [];
  }

  async updateStatus(order: any) {
    const { error } = await this.supabase.client
      .from('pedidos')
      .update({ estado: order.estado })
      .eq('id', order.id);
    
    if (error) alert("Error al actualizar pedido");
  }

  viewDetails(order: any) {
    // Implementaremos un modal o página de detalle después
    alert(`Detalles del pedido #${order.id.substring(0,8)}:\n${order.direccion_referencias}`);
  }
}
