import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
      <div class="premium-card fade-in" style="width: 100%; max-width: 450px; padding: 3rem;">
        <h1 class="brand-font" style="font-size: 3rem; text-align: center; margin-bottom: 1rem; color: var(--primary-dark);">Bienvenido</h1>
        <p style="text-align: center; opacity: 0.7; margin-bottom: 3rem;">Inicia sesión para endulzar tu día.</p>

        <form (submit)="onSubmit()" style="display: grid; gap: 1.5rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Correo Electrónico</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   placeholder="tu@correo.com"
                   style="width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid #ddd; font-family: inherit;">
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Contraseña</label>
            <input type="password" [(ngModel)]="password" name="password" required
                   placeholder="••••••••"
                   style="width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid #ddd; font-family: inherit;">
          </div>

          <div *ngIf="errorMessage()" style="color: var(--error); font-size: 0.9rem; text-align: center;">
            {{errorMessage()}}
          </div>

          <button class="btn-primary" type="submit" [disabled]="loading()" 
                  style="width: 100%; padding: 1.2rem; font-size: 1.1rem; margin-top: 1rem;">
            {{ loading() ? 'Cargando...' : 'Entrar' }}
          </button>
        </form>

        <p style="text-align: center; margin-top: 2rem; font-size: 0.9rem;">
          ¿No tienes cuenta? <a routerLink="/register" style="color: var(--primary-dark); font-weight: 700; text-decoration: none;">Regístrate aquí</a>
        </p>
      </div>
    </section>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');

  async onSubmit() {
    this.errorMessage.set('');
    this.loading.set(true);
    
    const success = await this.auth.login(this.email, this.password);
    
    if (success) {
      const user = this.auth.currentUser();
      if (user?.rol === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.errorMessage.set('Correo o contraseña incorrectos.');
    }
    this.loading.set(false);
  }
}
