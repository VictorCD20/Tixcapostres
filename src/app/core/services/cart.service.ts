import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  producto_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  // Selectores reactivos
  items = computed(() => this.cartItems());
  
  totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.cantidad, 0)
  );

  subtotal = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
  );

  addToCart(product: any) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.producto_id === product.id);

    if (existingItem) {
      this.cartItems.update(items => items.map(item => 
        item.producto_id === product.id 
          ? { ...item, cantidad: item.cantidad + 1 } 
          : item
      ));
    } else {
      const newItem: CartItem = {
        producto_id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1,
        imagen_url: product.imagen_url
      };
      this.cartItems.update(items => [...items, newItem]);
    }
  }

  removeFromCart(productId: number) {
    this.cartItems.update(items => items.filter(item => item.producto_id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items => items.map(item => 
      item.producto_id === productId ? { ...item, cantidad: quantity } : item
    ));
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
