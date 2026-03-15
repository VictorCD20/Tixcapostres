import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from './supabase.service';
import { Router } from '@angular/router';

export interface UserSession {
  id: string;
  email: string;
  nombre: string;
  rol: 'cliente' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private userSignal = signal<UserSession | null>(null);

  // Selectores reactivos
  currentUser = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.userSignal());
  isAdmin = computed(() => this.userSignal()?.rol === 'admin');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Intentar recuperar sesión de localStorage al iniciar
      const savedSession = localStorage.getItem('tixca_session');
      if (savedSession) {
        this.userSignal.set(JSON.parse(savedSession));
      }
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.client
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('password', password) // Nota: En producción usar hashing
        .single();

      if (error || !data) throw new Error('Credenciales inválidas');

      const session: UserSession = {
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        rol: data.rol
      };

      this.saveSession(session);
      return true;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  }

  async register(userData: any): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.client
        .from('usuarios')
        .insert([{
          ...userData,
          rol: 'cliente' // Por defecto siempre clientes
        }])
        .select()
        .single();

      if (error) throw error;

      const session: UserSession = {
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        rol: data.rol
      };

      this.saveSession(session);
      return true;
    } catch (e) {
      console.error('Register error:', e);
      return false;
    }
  }

  logout() {
    this.userSignal.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('tixca_session');
    }
    this.router.navigate(['/']);
  }

  private saveSession(session: UserSession) {
    this.userSignal.set(session);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('tixca_session', JSON.stringify(session));
    }
  }
}
