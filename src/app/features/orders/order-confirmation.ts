import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section style="padding: 6rem 0; text-align: center;">
      <div class="container fade-in">
        <div style="background: var(--accent); width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; color: var(--secondary);">
          <span class="material-icons" style="font-size: 4rem;">check_circle</span>
        </div>
        
        <h1 style="font-size: 3.5rem; margin-bottom: 1.5rem;">¡Gracias por tu pedido!</h1>
        <p style="font-size: 1.4rem; opacity: 0.7; max-width: 600px; margin: 0 auto 3rem;">
          Estamos preparando tus postres con mucho amor. Recibirás una notificación cuando el repartidor esté en camino.
        </p>

        <div class="premium-card" style="max-width: 500px; margin: 0 auto 3rem; text-align: left;" *ngIf="order">
          <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Resumen del Pedido #{{orderId.substring(0,8)}}</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Total:</span>
            <span style="font-weight: 700;">\${{order.total}}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Estado:</span>
            <span style="color: var(--primary-dark); font-weight: 600; text-transform: capitalize;">{{order.estado}}</span>
          </div>
          <div style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.6;">
            Entrega a domicilio en: {{order.direccion_colonia}}
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="btn-primary" routerLink="/">Volver al Inicio</button>
          <button class="btn-primary" style="background: var(--accent); color: var(--secondary);" routerLink="/mis-pedidos">Ver Mis Pedidos</button>
        </div>
      </div>
    </section>
  `
})
export class OrderConfirmationComponent implements OnInit {
  route = inject(ActivatedRoute);
  supabase = inject(SupabaseService);
  
  orderId = '';
  order: any = null;

  async ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      const { data } = await this.supabase.client
        .from('pedidos')
        .select('*')
        .eq('id', this.orderId)
        .single();
      this.order = data;
    }
  }
}
