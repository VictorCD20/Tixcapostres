import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-inventory',
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
          <a routerLink="/admin/inventario" class="nav-link active">Inventario</a>
          <a routerLink="/" class="nav-link" style="margin-top: 5rem; opacity: 0.6;">Volver</a>
        </nav>
      </aside>

      <main style="flex: 1; padding: 3rem;">
        <h1 style="font-size: 2.5rem; margin-bottom: 2rem;">Control de Inventario</h1>

        <div class="premium-card">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #f0f0f0;">
                <th style="padding: 1rem;">Producto</th>
                <th style="padding: 1rem;">En Stock</th>
                <th style="padding: 1rem;">Estado</th>
                <th style="padding: 1rem;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let prod of inventory" style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 1rem; font-weight: 600;">{{prod.nombre}}</td>
                <td style="padding: 1rem;">
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <button (click)="updateStock(prod, -1)" style="border: 1px solid #ddd; width: 30px; height: 30px; border-radius: 5px;">-</button>
                    <span style="font-size: 1.2rem; min-width: 40px; text-align: center;">{{prod.stock}}</span>
                    <button (click)="updateStock(prod, 1)" style="border: 1px solid #ddd; width: 30px; height: 30px; border-radius: 5px;">+</button>
                  </div>
                </td>
                <td style="padding: 1rem;">
                  <span [style.background]="prod.stock < 5 ? '#ffdce0' : '#d4edda'" 
                        [style.color]="prod.stock < 5 ? '#c82333' : '#155724'"
                        style="padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem;">
                    {{ prod.stock < 5 ? 'Bajo' : 'Óptimo' }}
                  </span>
                </td>
                <td style="padding: 1rem;">
                  <button (click)="saveStock(prod)" style="background: var(--primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 50px; cursor: pointer;">Guardar</button>
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
export class AdminInventoryComponent implements OnInit {
  supabase = inject(SupabaseService);
  inventory: any[] = [];

  async ngOnInit() {
    await this.loadInventory();
  }

  async loadInventory() {
    const { data } = await this.supabase.client.from('productos').select('id, nombre, stock').order('nombre');
    this.inventory = data || [];
  }

  updateStock(prod: any, amount: number) {
    prod.stock = Math.max(0, prod.stock + amount);
  }

  async saveStock(prod: any) {
    const { error } = await this.supabase.client
      .from('productos')
      .update({ stock: prod.stock })
      .eq('id', prod.id);
    
    if (!error) alert('Stock actualizado');
  }
}
