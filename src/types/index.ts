export interface Equipo {
  id: number
  nombre: string
  categoria: string
  disponible: boolean
}

export interface Prestamo {
  id: number
  equipoId: number
  solicitante: string
  carne: string
  fechaPrestamo: string
  fechaLimite: string
  devuelto: boolean
}

export type NuevoPrestamo = Omit<Prestamo, 'id'>

export type ActualizacionEquipo = Partial<Pick<Equipo, 'disponible'>>

export type ActualizacionPrestamo = Partial<Pick<Prestamo, 'devuelto'>>
