import type { Prestamo } from '../types'

export function fechaLocalHoy(): string {
  const hoy = new Date()
  const desfase = hoy.getTimezoneOffset() * 60_000
  return new Date(hoy.getTime() - desfase).toISOString().slice(0, 10)
}

export function addCalendarDays(fecha: string, dias: number): string {
  const fechaCalculada = new Date(`${fecha}T12:00:00`)
  fechaCalculada.setDate(fechaCalculada.getDate() + dias)
  const desfase = fechaCalculada.getTimezoneOffset() * 60_000
  return new Date(fechaCalculada.getTime() - desfase).toISOString().slice(0, 10)
}

export function esFechaVencida(fechaLimite: string): boolean {
  return fechaLimite.slice(0, 10) < fechaLocalHoy()
}

export function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(fecha))
}

export function contarPrestamosVencidos(prestamos: Prestamo[]): number {
  return prestamos.filter((prestamo) => esFechaVencida(prestamo.fechaLimite))
    .length
}
