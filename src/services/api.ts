import type {
  ActualizacionEquipo,
  ActualizacionPrestamo,
  Equipo,
  NuevoPrestamo,
  Prestamo,
} from '../types'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(
  /\/$/,
  '',
)

async function solicitar<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  let respuesta: Response
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: {
        'Content-Type': 'application/json',
        ...opciones?.headers,
      },
    })
  } catch {
    throw new Error(
      `No fue posible conectar con la API (${API_URL}). Verifica que json-server esté ejecutándose.`,
    )
  }

  if (!respuesta.ok) {
    throw new Error(
      `La API respondió con ${respuesta.status} ${respuesta.statusText || 'Error'}. Intenta de nuevo.`,
    )
  }

  if (respuesta.status === 204) return undefined as T
  return (await respuesta.json()) as T
}

export function obtenerEquipos(): Promise<Equipo[]> {
  return solicitar<Equipo[]>('/equipos')
}

export function obtenerPrestamosActivos(): Promise<Prestamo[]> {
  return solicitar<Prestamo[]>('/prestamos?devuelto=false')
}

export function crearPrestamo(prestamo: NuevoPrestamo): Promise<Prestamo> {
  return solicitar<Prestamo>('/prestamos', {
    method: 'POST',
    body: JSON.stringify(prestamo),
  })
}

export function actualizarEquipo(
  id: number,
  cambios: ActualizacionEquipo,
): Promise<Equipo> {
  return solicitar<Equipo>(`/equipos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(cambios),
  })
}

export function actualizarPrestamo(
  id: number,
  cambios: ActualizacionPrestamo,
): Promise<Prestamo> {
  return solicitar<Prestamo>(`/prestamos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(cambios),
  })
}
