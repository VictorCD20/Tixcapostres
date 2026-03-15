import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { MenuComponent } from './features/menu/menu';
import { ProductDetailComponent } from './features/products/product-detail';
import { CartPageComponent } from './features/cart/cart-page';
import { CheckoutComponent } from './features/checkout/checkout';
import { OrderConfirmationComponent } from './features/orders/order-confirmation';
import { MyOrdersComponent } from './features/orders/my-orders';
import { AdminDashboardComponent } from './features/admin/dashboard';
import { AdminOrdersComponent } from './features/admin/orders';
import { AdminOrderDetailComponent } from './features/admin/order-detail';
import { AdminProductsComponent } from './features/admin/products';
import { AdminInventoryComponent } from './features/admin/inventory';
import { AdminSalesComponent } from './features/admin/sales';
import { LoginComponent } from './features/auth/login';
import { RegisterComponent } from './features/auth/register';
import { adminGuard, authGuard } from './core/guards';

export const routes: Routes = [
  // AUTH
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // CLIENTE
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'carrito', component: CartPageComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'pedido-confirmado/:id', component: OrderConfirmationComponent, canActivate: [authGuard] },
  { path: 'mis-pedidos', component: MyOrdersComponent, canActivate: [authGuard] },

  // ADMIN
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/pedidos', component: AdminOrdersComponent, canActivate: [adminGuard] },
  { path: 'admin/pedidos/:id', component: AdminOrderDetailComponent, canActivate: [adminGuard] },
  { path: 'admin/productos', component: AdminProductsComponent, canActivate: [adminGuard] },
  { path: 'admin/inventario', component: AdminInventoryComponent, canActivate: [adminGuard] },
  { path: 'admin/ventas', component: AdminSalesComponent, canActivate: [adminGuard] },

  { path: '**', redirectTo: '' }
];
