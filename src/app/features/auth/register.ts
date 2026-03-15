import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
      <div class="premium-card fade-in" style="width: 100%; max-width: 500px; padding: 3rem;">
        <h1 class="brand-font" style="font-size: 3rem; text-align: center; margin-bottom: 1rem; color: var(--primary-dark);">Únete a Tixca</h1>
        <p style="text-align: center; opacity: 0.7; margin-bottom: 3rem;">Crea tu cuenta y empieza a pedir tus postres favoritos.</p>

        <form (submit)="onSubmit()" style="display: grid; gap: 1.2rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Nombre</label>
              <input type="text" [(ngModel)]="userData.nombre" name="nombre" required
                     placeholder="Ej. Juan"
                     style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 1px solid #ddd; font-family: inherit;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Apellido</label>
              <input type="text" [(ngModel)]="userData.apellido" name="apellido" required
                     placeholder="Ej. Pérez"
                     style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 1px solid #ddd; font-family: inherit;">
            </div>
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Correo Electrónico</label>
            <input type="email" [(ngModel)]="userData.email" name="email" required
                   placeholder="tu@correo.com"
                   style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 1px solid #ddd; font-family: inherit;">
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Contraseña</label>
            <input type="password" [(ngModel)]="userData.password" name="password" required
                   placeholder="Mínimo 6 caracteres"
                   style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 1px solid #ddd; font-family: inherit;">
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Teléfono</label>
            <input type="tel" [(ngModel)]="userData.telefono" name="telefono"
                   placeholder="999 000 0000"
                   style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 1px solid #ddd; font-family: inherit;">
          </div>

          <div *ngIf="errorMessage()" style="color: var(--error); font-size: 0.9rem; text-align: center;">
            {{errorMessage()}}
          </div>

          <button class="btn-primary" type="submit" [disabled]="loading()" 
                  style="width: 100%; padding: 1.2rem; font-size: 1.1rem; margin-top: 1rem;">
            {{ loading() ? 'Creando cuenta...' : 'Registrarme' }}
          </button>
        </form>

        <p style="text-align: center; margin-top: 2rem; font-size: 0.9rem;">
          ¿Ya tienes cuenta? <a routerLink="/login" style="color: var(--primary-dark); font-weight: 700; text-decoration: none;">Inicia sesión</a>
        </p>
      </div>
    </section>
  `
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  userData = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: ''
  };

  loading = signal(false);
  errorMessage = signal('');

  async onSubmit() {
    this.errorMessage.set('');
    this.loading.set(true);
    
    const success = await this.auth.register(this.userData);
    
    if (success) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage.set('Hubo un error al crear tu cuenta. Intenta con otro correo.');
    }
    this.loading.set(false);
  }
}
