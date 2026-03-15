import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="display: flex; min-height: 100vh; background: #f8f9fa;">
      <aside style="width: 260px; background: var(--secondary); color: white; padding: 2rem;">
        <h2 class="brand-font" style="font-size: 2rem; margin-bottom: 3rem; color: var(--primary);">Admin Tixca</h2>
        <nav style="display: grid; gap: 1rem;">
          <a routerLink="/admin" class="nav-link">Dashboard</a>
          <a routerLink="/admin/pedidos" class="nav-link active">Pedidos</a>
          <a routerLink="/admin/productos" class="nav-link">Productos</a>
          <a routerLink="/" class="nav-link" style="margin-top: 5rem; opacity: 0.6;">Volver</a>
        </nav>
      </aside>

      <main style="flex: 1; padding: 3rem;" *ngIf="order()">
        <header style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem;">
          <div>
            <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Pedido #{{order().id.substring(0,8)}}</h1>
            <p style="opacity: 0.7;">Realizado el {{order().created_at | date:'medium'}}</p>
          </div>
          <div [class]="'badge ' + order().estado" style="padding: 0.8rem 1.5rem; border-radius: 50px; font-weight: 700; text-transform: capitalize; font-size: 1.1rem;">
            {{order().estado}}
          </div>
        </header>

        <div style="display: grid; grid-template-columns: 1fr 400px; gap: 3rem;">
          <!-- Detalle Items -->
          <div class="premium-card">
            <h2 style="margin-bottom: 2rem;">Productos</h2>
            <div style="display: grid; gap: 1rem;">
              <!-- Suponiendo que items_pedidos es una tabla relacional o un JSON en el pedido -->
              <p *ngIf="!order().items">Cargando ítems...</p>
              <div *ngFor="let item of order().items" style="display: flex; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid #f0f0f0;">
                <span>{{item.nombre}} x{{item.cantidad}}</span>
                <span style="font-weight: 600;">\${{item.precio * item.cantidad}}</span>
              </div>
            </div>
          </div>

          <!-- Info Cliente / Entrega -->
          <aside style="display: grid; gap: 2rem;">
            <div class="premium-card">
              <h2 style="margin-bottom: 1.5rem;">Entrega</h2>
              <p><strong>Tipo:</strong> {{order().tipo_entrega}}</p>
              <p><strong>Colonia:</strong> {{order().direccion_colonia}}</p>
              <p><strong>Referencias:</strong> {{order().direccion_referencias}}</p>
            </div>
            
            <div class="premium-card" style="background: var(--accent); color: var(--secondary);">
              <h3>Total del Pedido</h3>
              <p style="font-size: 2rem; font-weight: 700; margin: 0;">\${{order().total}}</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .nav-link { color: rgba(255,255,255,0.7); text-decoration: none; padding: 0.8rem 1rem; border-radius: 10px; }
    .nav-link.active { background: rgba(255,255,255,0.1); color: white; }
    .badge.pendiente { background: #fff3cd; color: #856404; }
    .badge.entregado { background: #d4edda; color: #155724; }
  `]
})
export class AdminOrderDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  supabase = inject(SupabaseService);
  order = signal<any>(null);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const { data } = await this.supabase.client
        .from('pedidos')
        .select('*')
        .eq('id', id)
        .single();
      this.order.set(data);
    }
  }
}
