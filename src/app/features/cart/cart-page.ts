import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section style="padding: 4rem 0;">
      <div class="container">
        <h1 style="font-size: 3rem; margin-bottom: 3rem;">Tu Carrito de Postres</h1>

        <div *ngIf="cart.items().length > 0; else emptyCart" style="display: grid; grid-template-columns: 1fr 350px; gap: 3rem;">
          
          <!-- Lista de Items -->
          <div class="fade-in">
            <div class="premium-card" style="padding: 0; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead style="background: var(--accent); color: var(--secondary);">
                  <tr>
                    <th style="padding: 1.5rem; text-align: left;">Producto</th>
                    <th style="padding: 1.5rem; text-align: center;">Cantidad</th>
                    <th style="padding: 1.5rem; text-align: right;">Precio</th>
                    <th style="padding: 1.5rem;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of cart.items()" style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem;">
                      <div style="width: 60px; height: 60px; background: #eee; border-radius: 10px; overflow: hidden;">
                        <img *ngIf="item.imagen_url" [src]="item.imagen_url" style="width: 100%; height: 100%; object-fit: cover;">
                      </div>
                      <span style="font-weight: 600;">{{item.nombre}}</span>
                    </td>
                    <td style="padding: 1.5rem; text-align: center;">
                      <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem;">
                        <button (click)="cart.updateQuantity(item.producto_id, item.cantidad - 1)" style="border: none; background: #eee; width: 30px; height: 30px; border-radius: 5px; cursor: pointer;">-</button>
                        <span style="width: 30px;">{{item.cantidad}}</span>
                        <button (click)="cart.updateQuantity(item.producto_id, item.cantidad + 1)" style="border: none; background: #eee; width: 30px; height: 30px; border-radius: 5px; cursor: pointer;">+</button>
                      </div>
                    </td>
                    <td style="padding: 1.5rem; text-align: right; font-weight: 600;">\${{item.precio * item.cantidad}}</td>
                    <td style="padding: 1.5rem; text-align: center;">
                      <button (click)="cart.removeFromCart(item.producto_id)" style="border: none; background: none; color: var(--error); cursor: pointer;">
                        <span class="material-icons">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <button class="btn-primary" style="margin-top: 2rem; background: var(--accent); color: var(--secondary);" routerLink="/menu">
              <span class="material-icons">arrow_back</span>
              Seguir Comprando
            </button>
          </div>

          <!-- Resumen -->
          <aside class="fade-in">
            <div class="premium-card">
              <h2 style="font-size: 1.5rem; margin-bottom: 2rem;">Resumen de Compra</h2>
              <div style="display: flex; justify-content: space-between; font-size: 1.2rem; margin-bottom: 1rem;">
                <span>Subtotal</span>
                <span>\${{cart.subtotal()}}</span>
              </div>
              <p style="font-size: 0.9rem; opacity: 0.6; margin-bottom: 2rem;">El costo de envío se calculará en la siguiente pantalla.</p>
              
              <button class="btn-primary" style="width: 100%; padding: 1.5rem; font-size: 1.2rem;" routerLink="/checkout">
                Continuar al Pago
              </button>
            </div>
          </aside>

        </div>

        <ng-template #emptyCart>
          <div style="text-align: center; padding: 5rem;" class="fade-in">
            <span class="material-icons" style="font-size: 6rem; opacity: 0.2; margin-bottom: 1.5rem;">shopping_bag</span>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">Tu carrito está vacío.</p>
            <button class="btn-primary" routerLink="/menu">Ver el Menú</button>
          </div>
        </ng-template>
      </div>
    </section>
  `
})
export class CartPageComponent {
  cart = inject(CartService);
}
