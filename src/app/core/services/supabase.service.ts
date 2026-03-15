import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Estas credenciales deben ser reemplazadas por las reales o tomadas de enviroment.ts
    const supabaseUrl = 'https://ikqxsusaysiizdsnjech.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcXhzdXNheXNpaXpkc25qZWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjY3MDcsImV4cCI6MjA4NzQ0MjcwN30.TyyqumBj0UaNR-ve3HEZjtjYV0KLYP1W089QLzUjFkM';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  get client() {
    return this.supabase;
  }

  async getProducts() {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .eq('activo', true);

    if (error) throw error;
    return data;
  }

  async getCategories() {
    const { data, error } = await this.supabase
      .from('categorias')
      .select('*');

    if (error) throw error;
    return data;
  }
}
