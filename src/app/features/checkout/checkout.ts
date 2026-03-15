import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section style="padding: 4rem 0;">
      <div class="container" style="display: grid; grid-template-columns: 1fr 400px; gap: 3rem;">
        
        <!-- Formulario de Entrega -->
        <div class="fade-in">
          <h1 style="font-size: 3rem; margin-bottom: 2rem;">Finalizar Pedido</h1>
          
          <div class="premium-card" style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.8rem; margin-bottom: 1.5rem; font-family: 'Montserrat', sans-serif;">Detalles de Entrega</h2>
            
            <div style="display: grid; gap: 1.5rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Fraccionamiento / Colonia</label>
                <input type="text" [(ngModel)]="colonia" (blur)="calcularEnvio()" 
                       placeholder="Ej. La Joya, Paseos de Opichen..." 
                       style="width: 100%; padding: 1rem; border-radius: 10px; border: 1px solid #ddd; font-family: inherit;">
              </div>
              
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Referencias de la casa</label>
                <textarea [(ngModel)]="referencias" 
                          placeholder="Fachada color... entre calle X y Y..." 
                          style="width: 100%; padding: 1rem; border-radius: 10px; border: 1px solid #ddd; font-family: inherit; height: 100px;"></textarea>
              </div>

              <div style="display: flex; gap: 1rem; align-items: center; background: var(--accent); padding: 1rem; border-radius: 10px;">
                <span class="material-icons" style="color: var(--primary-dark);">info</span>
                <p style="font-size: 0.9rem; margin: 0;">
                  El costo de envío se calcula automáticamente según tu ubicación o colonia.
                </p>
              </div>
            </div>
          </div>

          <button class="btn-primary" 
                  style="width: 100%; padding: 1.5rem; font-size: 1.3rem;"
                  [disabled]="!colonia || subiendo"
                  (click)="confirmarPedido()">
            {{ subiendo ? 'Procesando...' : 'Confirmar y Pagar contra Entrega' }}
          </button>
        </div>

        <!-- Resumen del Carrito -->
        <aside>
          <div class="premium-card" style="position: sticky; top: 120px;">
            <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; font-family: 'Montserrat', sans-serif;">Resumen</h2>
            
            <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
              <div *ngFor="let item of cart.items()" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 0.5rem;">
                <div>
                  <p style="font-weight: 600; margin: 0;">{{item.nombre}} x{{item.cantidad}}</p>
                  <p style="font-size: 0.8rem; opacity: 0.6; margin: 0;">\${{item.precio}} c/u</p>
                </div>
                <span style="font-weight: 600;">\${{item.precio * item.cantidad}}</span>
              </div>
            </div>

            <div style="display: grid; gap: 0.8rem; font-size: 1.1rem;">
              <div style="display: flex; justify-content: space-between;">
                <span>Subtotal</span>
                <span>\${{cart.subtotal()}}</span>
              </div>
              <div style="display: flex; justify-content: space-between; color: var(--primary-dark);">
                <span>Envío</span>
                <span>+ \${{envio()}}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.5rem; margin-top: 1rem; border-top: 2px solid var(--background); padding-top: 1rem;">
                <span>Total</span>
                <span>\${{cart.subtotal() + envio()}}</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </section>
  `
})
export class CheckoutComponent {
  cart = inject(CartService);
  supabase = inject(SupabaseService);
  
  colonia = '';
  referencias = '';
  envio = signal(0);
  subiendo = false;

  async calcularEnvio() {
    if (!this.colonia) return;

    try {
      // Llamada a la Edge Function 'calcular-envio'
      // Por ahora simulamos la lat/lng ya que no tenemos mapa integrado aún
      const { data, error } = await this.supabase.client.functions.invoke('calcular-envio', {
        body: { 
          lat: 18.0, // Placeholder
          lng: -94.0, // Placeholder
          colonia: this.colonia 
        }
      });

      if (error) throw error;
      this.envio.set(data.costo_envio);
    } catch (e) {
      console.error("Error al calcular envío", e);
    }
  }

  async confirmarPedido() {
    this.subiendo = true;
    try {
      const { data, error } = await this.supabase.client.functions.invoke('crear-pedido', {
        body: {
          usuario_id: '88888888-8888-8888-8888-888888888888', // Placeholder usuario-demo
          items: this.cart.items(),
          tipo_entrega: 'domicilio',
          costo_envio: this.envio(),
          direccion: {
            lat: 18.0,
            lng: -94.0,
            colonia: this.colonia,
            referencias: this.referencias
          }
        }
      });

      if (error) throw error;
      
      alert('¡Pedido realizado con éxito!');
      this.cart.clearCart();
      // Redirigir a confirmación (penditente)
    } catch (e) {
      alert("Error al procesar pedido: " + e);
    } finally {
      this.subiendo = false;
    }
  }
}
