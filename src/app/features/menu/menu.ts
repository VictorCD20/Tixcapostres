import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding: 4rem 0;">
      <div class="container">
        <h1 style="font-size: 3.5rem; text-align: center; margin-bottom: 3rem;">Nuestro Menú Dulce</h1>
        
        <!-- Filtro de Categorías -->
        <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 4rem; overflow-x: auto; padding-bottom: 1rem;">
          <button class="btn-primary" [class.active]="selectedCategory === null" (click)="filterByCategory(null)" style="background: var(--accent); color: var(--secondary);">Todos</button>
          <button *ngFor="let cat of categories" 
                  class="btn-primary" 
                  [class.active]="selectedCategory === cat.id"
                  (click)="filterByCategory(cat.id)"
                  style="background: var(--accent); color: var(--secondary);">
            {{cat.nombre}}
          </button>
        </div>

        <!-- Grid de Productos -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2.5rem;">
          <div class="premium-card fade-in" *ngFor="let prod of filteredProducts">
            <div style="position: relative; height: 250px; background: #f0f0f0; border-radius: 15px; overflow: hidden; margin-bottom: 1.5rem;">
              <img *ngIf="prod.imagen_url" [src]="prod.imagen_url" [alt]="prod.nombre" style="width: 100%; height: 100%; object-fit: cover;">
              <div *ngIf="!prod.imagen_url" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #ccc;">
                <span class="material-icons" style="font-size: 4rem;">image</span>
              </div>
            </div>
            <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem;">{{prod.nombre}}</h3>
            <p style="font-size: 0.9rem; opacity: 0.7; height: 3rem; overflow: hidden; margin-bottom: 1.5rem;">{{prod.descripcion}}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 1.3rem; color: var(--primary-dark);">\${{prod.precio}}</span>
              <button class="btn-primary" style="padding: 0.6rem 1.2rem;" (click)="cart.addToCart(prod)">
                <span class="material-icons" style="font-size: 1.2rem;">add_shopping_cart</span>
                Agregar
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredProducts.length === 0" style="text-align: center; padding: 4rem; opacity: 0.5;">
          <span class="material-icons" style="font-size: 5rem; margin-bottom: 1rem;">sentiment_dissatisfied</span>
          <p>No encontramos postres en esta categoría por ahora.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .btn-primary.active {
      background-color: var(--primary) !important;
      color: white !important;
      box-shadow: 0 4px 10px rgba(255, 139, 167, 0.3);
    }
  `]
})
export class MenuComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  selectedCategory: number | null = null;
  cart = inject(CartService);

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    try {
      this.products = await this.supabase.getProducts();
      this.filteredProducts = [...this.products];
      this.categories = await this.supabase.getCategories();
    } catch (e) {
      console.error("Error cargando el menú", e);
    }
  }

  filterByCategory(id: number | null) {
    this.selectedCategory = id;
    if (id === null) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(p => p.categoria_id === id);
    }
  }
}
