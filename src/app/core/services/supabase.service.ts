import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
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
