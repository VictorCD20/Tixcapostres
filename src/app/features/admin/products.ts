import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div style="display: flex; min-height: 100vh; background: #f8f9fa;">
      <aside style="width: 260px; background: var(--secondary); color: white; padding: 2rem;">
        <h2 class="brand-font" style="font-size: 2rem; margin-bottom: 3rem; color: var(--primary);">Admin Tixca</h2>
        <nav style="display: grid; gap: 1rem;">
          <a routerLink="/admin" class="nav-link">Dashboard</a>
          <a routerLink="/admin/pedidos" class="nav-link">Pedidos</a>
          <a routerLink="/admin/productos" class="nav-link active">Productos</a>
          <a routerLink="/admin/inventario" class="nav-link">Inventario</a>
          <a routerLink="/" class="nav-link" style="margin-top: 5rem; opacity: 0.6;">Volver</a>
        </nav>
      </aside>

      <main style="flex: 1; padding: 3rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <h1 style="font-size: 2.5rem;">Gestión de Productos</h1>
          <button class="btn-primary" (click)="showForm = true">
            <span class="material-icons">add</span>
            Nuevo Postre
          </button>
        </div>

        <!-- Formulario Flotante/Modal Simple -->
        <div *ngIf="showForm" class="glass" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; z-index: 2000;">
          <div class="premium-card" style="width: 500px; max-height: 90vh; overflow-y: auto;">
            <h2 style="margin-bottom: 1.5rem;">{{ editingId ? 'Editar' : 'Nuevo' }} Producto</h2>
            <div style="display: grid; gap: 1rem;">
              <input type="text" [(ngModel)]="currentProd.nombre" placeholder="Nombre del postre" style="padding: 0.8rem; border-radius: 8px; border: 1px solid #ddd;">
              <textarea [(ngModel)]="currentProd.descripcion" placeholder="Descripción" style="padding: 0.8rem; border-radius: 8px; border: 1px solid #ddd;"></textarea>
              <input type="number" [(ngModel)]="currentProd.precio" placeholder="Precio ($)" style="padding: 0.8rem; border-radius: 8px; border: 1px solid #ddd;">
              <input type="text" [(ngModel)]="currentProd.imagen_url" placeholder="URL de la imagen" style="padding: 0.8rem; border-radius: 8px; border: 1px solid #ddd;">
              
              <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn-primary" style="flex: 1;" (click)="saveProduct()">Guardar</button>
                <button (click)="closeForm()" style="flex: 1; border: none; background: #eee; border-radius: 50px; cursor: pointer;">Cancelar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de Productos -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
          <div class="premium-card" *ngFor="let prod of products">
            <div style="height: 150px; background: #f0f0f0; border-radius: 10px; overflow: hidden; margin-bottom: 1rem;">
              <img *ngIf="prod.imagen_url" [src]="prod.imagen_url" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <h3 style="margin-bottom: 0.5rem;">{{prod.nombre}}</h3>
            <p style="font-size: 1.2rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 1rem;">\${{prod.precio}}</p>
            <div style="display: flex; gap: 0.5rem;">
              <button (click)="editProduct(prod)" style="flex: 1; border: 1px solid #ddd; background: white; padding: 0.5rem; border-radius: 8px; cursor: pointer;">Editar</button>
              <button (click)="deleteProduct(prod.id)" style="border: 1px solid var(--error); color: var(--error); background: white; padding: 0.5rem; border-radius: 8px; cursor: pointer;">
                <span class="material-icons" style="font-size: 1.2rem;">delete</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .nav-link { color: rgba(255,255,255,0.7); text-decoration: none; padding: 0.8rem 1rem; border-radius: 10px; }
    .nav-link.active { background: rgba(255,255,255,0.1); color: white; }
  `]
})
export class AdminProductsComponent implements OnInit {
  supabase = inject(SupabaseService);
  products: any[] = [];
  showForm = false;
  editingId: any = null;
  currentProd: any = { nombre: '', descripcion: '', precio: 0, imagen_url: '' };

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    const { data } = await this.supabase.client.from('productos').select('*').order('created_at', { ascending: false });
    this.products = data || [];
  }

  async saveProduct() {
    if (this.editingId) {
      await this.supabase.client.from('productos').update(this.currentProd).eq('id', this.editingId);
    } else {
      await this.supabase.client.from('productos').insert(this.currentProd);
    }
    await this.loadProducts();
    this.closeForm();
  }

  editProduct(prod: any) {
    this.editingId = prod.id;
    this.currentProd = { ...prod };
    this.showForm = true;
  }

  async deleteProduct(id: any) {
    if (confirm('¿Seguro que quieres eliminar este postre?')) {
      await this.supabase.client.from('productos').delete().eq('id', id);
      await this.loadProducts();
    }
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
    this.currentProd = { nombre: '', descripcion: '', precio: 0, imagen_url: '' };
  }
}
