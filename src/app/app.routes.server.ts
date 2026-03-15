import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'producto/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'pedido-confirmado/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/pedidos/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
