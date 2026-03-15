/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ORS_API_KEY = Deno.env.get('ORS_API_KEY')
const LOCAL_LAT = parseFloat(Deno.env.get('LOCAL_LAT') || '0')
const LOCAL_LNG = parseFloat(Deno.env.get('LOCAL_LNG') || '0')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Función para obtener el costo según la tabla manual proporcionada
 * 0 - 4 km: $35
 * 4.1 - 5 km: $40
 * ... aumenta $5 por cada km adicional
 */
/*
function calcularCostoTabla(distanciaKm: number): number {
  if (distanciaKm <= 4) return 35;
  if (distanciaKm <= 5) return 40;
  if (distanciaKm <= 6) return 45;
  if (distanciaKm <= 7) return 50;
  if (distanciaKm <= 8) return 55;
  if (distanciaKm <= 9) return 60;
  if (distanciaKm <= 10) return 65;
  if (distanciaKm <= 11) return 70;
  if (distanciaKm <= 12) return 75;
  if (distanciaKm <= 13) return 80;
  if (distanciaKm <= 14) return 85;
  if (distanciaKm <= 15) return 90;

  // Si es más de 15km, podemos seguir la tendencia o poner un tope/error
  // Según la nota "t+15 cruzar periferico", parece que hay cobros extra.
  // Por ahora seguimos la tendencia de +$5 por KM si es > 15
  return 90 + (Math.ceil(distanciaKm) - 15) * 5;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lat, lng, colonia } = await req.json()

    if (!lat || !lng) {
      throw new Error('Latitud y longitud son requeridas')
    }

    // Regla especial para fraccionamientos específicos
    const coloniasEspeciales = [
      'girasoles',
      'tixcacal opichen',
      'paseos de opichen',
      'la joya'
    ]

    let costoEnvio = 0
    let esEspecial = false

    if (colonia && coloniasEspeciales.includes(colonia.toLowerCase().trim())) {
      costoEnvio = 20
      esEspecial = true
    }

    // Si no es colonia especial, calculamos por distancia
    let distanciaKm = 0
    if (!esEspecial) {
      // Llamada a OpenRouteService
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${LOCAL_LNG},${LOCAL_LAT}&end=${lng},${lat}`

      const response = await fetch(url)
      const data = await response.json()

      if (!data.features || data.features.length === 0) {
        throw new Error('No se pudo calcular la ruta')
      }

      const distanciaMetros = data.features[0].properties.summary.distance
      distanciaKm = parseFloat((distanciaMetros / 1000).toFixed(2))
      costoEnvio = calcularCostoTabla(distanciaKm)
    }

    return new Response(
      JSON.stringify({
        distancia_km: distanciaKm,
        costo_envio: costoEnvio,
        unidad: 'MXN',
        colonia_especial: esEspecial,
        aviso: !esEspecial && distanciaKm > 15 ? 'Cruzar periférico puede tener costo extra' : null
      }),
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