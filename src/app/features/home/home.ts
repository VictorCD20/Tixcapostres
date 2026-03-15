import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section class="hero fade-in" style="padding: 6rem 0; text-align: center; background: linear-gradient(rgba(242, 238, 231, 0.7), rgba(242, 238, 231, 0.7)), url('assets/hero-bg.jpg'); background-size: cover; background-position: center;">
      <div class="container">
        <h1 style="font-size: 5rem; color: var(--primary-dark); margin-bottom: 1rem;">Endulza tu momento</h1>
        <p style="font-size: 1.4rem; max-width: 600px; margin: 0 auto 2.5rem; opacity: 0.9;">
          Postres artesanales hechos con amor y los mejores ingredientes. 
          Directo de nuestra cocina a tu mesa.
        </p>
        
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="btn-primary" style="padding: 1.2rem 2.5rem; font-size: 1.2rem;" routerLink="/menu">
            Explorar Menú
            <span class="material-icons">arrow_forward</span>
          </button>
          
          <button *ngIf="!auth.isAuthenticated()" 
                  class="btn-primary" 
                  style="padding: 1.2rem 2.5rem; font-size: 1.2rem; background: var(--accent); color: var(--secondary);" 
                  routerLink="/register">
            Regístrate
            <span class="material-icons">person_add</span>
          </button>
        </div>
      </div>
    </section>

    <section style="padding: 5rem 0;">
      <div class="container">
        <h2 style="font-size: 3rem; text-align: center; margin-bottom: 3rem;">Nuestras Especialidades</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <!-- Placeholder cards -->
          <div class="premium-card" *ngFor="let item of [1,2,3]">
            <div style="height: 200px; background: #eee; border-radius: 15px; margin-bottom: 1.5rem;"></div>
            <h3 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Postre Delicioso {{item}}</h3>
            <p style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 1.5rem;">Una breve descripción de lo rico que está este postre artesanal preparado hoy.</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 1.2rem; color: var(--primary-dark);">$150.00</span>
              <button class="btn-primary" style="padding: 0.5rem 1rem;">Agregar</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent {
  auth = inject(AuthService);
}
