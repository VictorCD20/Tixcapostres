import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section style="padding: 4rem 0;" *ngIf="product(); else loading">
      <div class="container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start;">
        
        <!-- Imagen -->
        <div class="fade-in" style="background: #f0f0f0; border-radius: 20px; overflow: hidden; aspect-ratio: 1; display: flex; align-items: center; justify-content: center;">
          <img *ngIf="product().imagen_url" [src]="product().imagen_url" [alt]="product().nombre" style="width: 100%; height: 100%; object-fit: cover;">
          <span *ngIf="!product().imagen_url" class="material-icons" style="font-size: 8rem; color: #ccc;">image</span>
        </div>

        <!-- Info -->
        <div class="fade-in">
          <nav style="margin-bottom: 2rem; opacity: 0.6;">
            <a routerLink="/menu" style="text-decoration: none; color: inherit;">Menú</a> / {{product().nombre}}
          </nav>
          
          <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">{{product().nombre}}</h1>
          <p style="font-size: 1.8rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 2rem;">\${{product().precio}}</p>
          
          <div class="premium-card" style="margin-bottom: 2rem;">
            <p style="font-size: 1.1rem; line-height: 1.6; margin: 0;">{{product().descripcion || 'Sin descripción disponible.'}}</p>
          </div>

          <div style="display: flex; gap: 1.5rem; align-items: center;">
            <button class="btn-primary" style="padding: 1.2rem 3rem; font-size: 1.2rem;" (click)="addToCart()">
              <span class="material-icons">add_shopping_cart</span>
              Agregar al Carrito
            </button>
          </div>
          
          <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.5;">Stock disponible: {{product().stock || 0}} unidades</p>
        </div>

      </div>
    </section>

    <ng-template #loading>
      <div style="text-align: center; padding: 10rem;">
        <p>Cargando postre...</p>
      </div>
    </ng-template>
  `
})
export class ProductDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  supabase = inject(SupabaseService);
  cart = inject(CartService);
  
  product = signal<any>(null);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const { data } = await this.supabase.client
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();
      this.product.set(data);
    }
  }

  addToCart() {
    this.cart.addToCart(this.product());
    alert('¡Agregado al carrito!');
  }
}
