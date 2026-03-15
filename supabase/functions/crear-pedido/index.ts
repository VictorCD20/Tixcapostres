/*import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { usuario_id, items, tipo_entrega, costo_envio, direccion } = await req.json()

    // 1. Validar Stock e Inventario
    for (const item of items) {
      const { data: inv, error: invError } = await supabaseClient
        .from('inventario')
        .select('cantidad')
        .eq('producto_id', item.producto_id)
        .single()

      if (invError || inv.cantidad < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto ID: ${item.producto_id}`)
      }
    }

    // 2. Calcular Totales (Snapshot de precios reales de la DB)
    let subtotal = 0
    const itemsParaCargar = []

    for (const item of items) {
      const { data: prod, error: prodError } = await supabaseClient
        .from('productos')
        .select('precio')
        .eq('id', item.producto_id)
        .single()

      if (prodError) throw new Error(`Error al obtener precio del producto ${item.producto_id}`)
      
      subtotal += prod.precio * item.cantidad
      itemsParaCargar.push({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: prod.precio
      })
    }

    const total = subtotal + (costo_envio || 0)

    // 3. Crear Pedido (Transacción manual simplificada)
    const { data: pedido, error: pedidoError } = await supabaseClient
      .from('pedidos')
      .insert({
        usuario_id,
        tipo_entrega,
        subtotal,
        costo_envio,
        total,
        direccion_latitud: direccion.lat,
        direccion_longitud: direccion.lng,
        direccion_colonia: direccion.colonia,
        direccion_referencias: direccion.referencias,
        estado: 'pendiente'
      })
      .select()
      .single()

    if (pedidoError) throw pedidoError

    // 4. Insertar items y descontar stock
    for (const item of itemsParaCargar) {
      await supabaseClient.from('pedidos_items').insert({
        pedido_id: pedido.id,
        ...item
      })

      // Descontar stock
      const { error: stockError } = await supabaseClient.rpc('decrementar_inventario', {
        prod_id: item.producto_id,
        cant: item.cantidad
      })
      // Nota: Necesitas crear esta función RPC en SQL o hacerlo vía consulta directa
    }

    return new Response(
      JSON.stringify({ success: true, pedido_id: pedido.id, total }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
*/