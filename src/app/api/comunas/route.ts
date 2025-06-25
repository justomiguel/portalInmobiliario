import { NextResponse } from 'next/server';

const FALLBACK_COMUNAS = [
  'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central',
  'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja',
  'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo',
  'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén',
  'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta',
  'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Santiago',
  'Vitacura'
];

const REGION_METROPOLITANA_ID = 13;

async function fetchFromSkualo() {
  const res = await fetch('https://api.skualo.cl/api/tablas/comunas', {
    headers: { 'Accept': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Skualo failed');
  const data = await res.json();
  if (!Array.isArray(data?.data)) throw new Error('Skualo data invalid');
  return data.data.filter((c: any) => c.idRegion === REGION_METROPOLITANA_ID).map((c: any) => c.nombre);
}

async function fetchFromGithub() {
  const res = await fetch('https://raw.githubusercontent.com/climoralesg/api-regiones-provincias-comunas-Chile/main/territoriochile.json');
  if (!res.ok) throw new Error('GitHub failed');
  const data = await res.json();
  // Buscar la región Metropolitana (id: 13 o nombre: 'Región Metropolitana de Santiago')
  const region = data.regiones?.find((r: any) => r.id === 13 || r.nombre.includes('Metropolitana'));
  if (!region) throw new Error('No region Metropolitana');
  return region.comunas.map((c: any) => c.nombre);
}

export async function GET() {
  let comunas: string[] = [];
  let source = '';
  try {
    comunas = await fetchFromSkualo();
    source = 'skualo';
  } catch {
    try {
      comunas = await fetchFromGithub();
      source = 'github';
    } catch {
      comunas = FALLBACK_COMUNAS;
      source = 'local';
    }
  }
  return NextResponse.json({ data: comunas, source });
} 