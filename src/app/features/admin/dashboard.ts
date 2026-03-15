import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="display: flex; min-height: 100vh; background: #f8f9fa;">
      <!-- Sidebar simple -->
      <aside style="width: 260px; background: var(--secondary); color: white; padding: 2rem;">
        <h2 class="brand-font" style="font-size: 2rem; margin-bottom: 3rem; color: var(--primary);">Admin Tixca</h2>
        <nav style="display: grid; gap: 1rem;">
          <a routerLink="/admin" class="nav-link active">Dashboard</a>
          <a routerLink="/admin/pedidos" class="nav-link">Pedidos</a>
          <a routerLink="/admin/productos" class="nav-link">Productos</a>
          <a routerLink="/admin/inventario" class="nav-link">Inventario</a>
          <a routerLink="/" class="nav-link" style="margin-top: 5rem; opacity: 0.6;">Volver a la Tienda</a>
        </nav>
      </aside>

      <!-- Contenido Principal -->
      <main style="flex: 1; padding: 3rem;">
        <header style="margin-bottom: 3rem;">
          <h1 style="font-size: 2.5rem; font-family: 'Montserrat', sans-serif;">Dashboard</h1>
          <p style="opacity: 0.7;">Resumen general de tu negocio hoy.</p>
        </header>

        <!-- Stats Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; margin-bottom: 4rem;">
          <div class="premium-card">
            <p style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 0.5rem;">Ventas del Día</p>
            <h3 style="font-size: 2rem; font-family: 'Montserrat', sans-serif;">\${{stats.ventasHoy}}</h3>
          </div>
          <div class="premium-card">
            <p style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 0.5rem;">Pedidos Pendientes</p>
            <h3 style="font-size: 2rem; font-family: 'Montserrat', sans-serif; color: var(--primary-dark);">{{stats.pedidosPendientes}}</h3>
          </div>
          <div class="premium-card">
            <p style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 0.5rem;">Total Productos</p>
            <h3 style="font-size: 2rem; font-family: 'Montserrat', sans-serif;">{{stats.totalProductos}}</h3>
          </div>
        </div>

        <!-- Pedidos Recientes -->
        <section class="premium-card">
          <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; font-family: 'Montserrat', sans-serif;">Últimos Pedidos</h2>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead style="border-bottom: 2px solid #f0f0f0;">
                <tr>
                  <th style="padding: 1rem;">ID</th>
                  <th style="padding: 1rem;">Estado</th>
                  <th style="padding: 1rem;">Total</th>
                  <th style="padding: 1rem;">Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of recentOrders" style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 1rem; font-size: 0.9rem;">#{{p.id.substring(0,8)}}</td>
                  <td style="padding: 1rem;">
                    <span [class]="'badge ' + p.estado">{{p.estado}}</span>
                  </td>
                  <td style="padding: 1rem; font-weight: 600;">\${{p.total}}</td>
                  <td style="padding: 1rem; opacity: 0.7;">{{p.created_at | date:'shortTime'}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .nav-link {
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      padding: 0.8rem 1rem;
      border-radius: 10px;
      transition: var(--transition);
    }
    .nav-link:hover, .nav-link.active {
      background: rgba(255,255,255,0.1);
      color: white;
    }
    .badge {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      text-transform: capitalize;
    }
    .pendiente { background: #fff3cd; color: #856404; }
    .pagado { background: #d4edda; color: #155724; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  supabase = inject(SupabaseService);
  stats = {
    ventasHoy: 0,
    pedidosPendientes: 0,
    totalProductos: 0
  };
  recentOrders: any[] = [];

  async ngOnInit() {
    await this.loadStats();
    await this.loadRecentOrders();
  }

  async loadStats() {
    // Estas consultas se optimizarán después
    const { count: prodCount } = await this.supabase.client
      .from('productos')
      .select('*', { count: 'exact', head: true });
    
    const { data: orders } = await this.supabase.client
      .from('pedidos')
      .select('total, estado')
      .gte('created_at', new Date().toISOString().split('T')[0]);

    this.stats.totalProductos = prodCount || 0;
    this.stats.ventasHoy = orders?.reduce((acc, o) => acc + (Number(o.total) || 0), 0) || 0;
    this.stats.pedidosPendientes = orders?.filter(o => o.estado === 'pendiente').length || 0;
  }

  async loadRecentOrders() {
    const { data } = await this.supabase.client
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    this.recentOrders = data || [];
  }
}
