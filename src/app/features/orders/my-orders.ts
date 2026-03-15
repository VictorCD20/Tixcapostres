import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding: 4rem 0;">
      <div class="container">
        <h1 style="font-size: 3rem; margin-bottom: 2.5rem;">Mis Pedidos</h1>
        
        <div style="display: grid; gap: 1.5rem;">
          <div *ngIf="orders.length === 0" style="text-align: center; padding: 4rem; opacity: 0.5;">
            <span class="material-icons" style="font-size: 4rem; margin-bottom: 1rem;">shopping_bag</span>
            <p>Aún no has realizado ningún pedido. ¡Ve al menú y endulza tu día!</p>
          </div>

          <div class="premium-card fade-in" *ngFor="let order of orders" style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
              <div>
                <span style="font-size: 0.8rem; opacity: 0.6; display: block; margin-bottom: 0.3rem;">PEDIDO #{{order.id.substring(0,8)}}</span>
                <span style="font-weight: 600; font-size: 1.1rem;">{{order.created_at | date:'mediumDate'}}</span>
              </div>
              <div [class]="'badge ' + order.estado" style="padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600; text-transform: capitalize;">
                {{order.estado}}
              </div>
            </div>

            <div style="border-top: 1px solid #f0f0f0; padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="margin: 0; opacity: 0.7;">Total pagado:</p>
                <p style="margin: 0; font-size: 1.4rem; font-weight: 700; color: var(--primary-dark);">\${{order.total}}</p>
              </div>
              <button class="btn-primary" style="background: var(--accent); color: var(--secondary);">Ver Detalle</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .badge.pendiente { background: #fff3cd; color: #856404; }
    .badge.entregado { background: #d4edda; color: #155724; }
    .badge.en_camino { background: #d1ecf1; color: #0c5460; }
  `]
})
export class MyOrdersComponent implements OnInit {
  supabase = inject(SupabaseService);
  orders: any[] = [];
  
  // Usaremos un ID fijo para demo por ahora ya que no hay login formal
  tempUserId = '88888888-8888-8888-8888-888888888888';

  async ngOnInit() {
    const { data } = await this.supabase.client
      .from('pedidos')
      .select('*')
      .eq('usuario_id', this.tempUserId)
      .order('created_at', { ascending: false });
    this.orders = data || [];
  }
}
