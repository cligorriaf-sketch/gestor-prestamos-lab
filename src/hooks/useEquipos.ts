import { useCallback, useEffect, useState } from 'react'
import { obtenerEquipos } from '../services/api'
import type { Equipo } from '../types'

export function useEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarEquipos = useCallback(async () => {
    try {
      setEquipos(await obtenerEquipos())
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No se pudo cargar el inventario. Intenta de nuevo.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const reintentar = useCallback(async () => {
    setLoading(true)
    setError(null)
    await cargarEquipos()
  }, [cargarEquipos])

  useEffect(() => {
    let vigente = true
    obtenerEquipos()
      .then((datos) => {
        if (vigente) setEquipos(datos)
      })
      .catch((cause: unknown) => {
        if (!vigente) return
        setError(
          cause instanceof Error
            ? cause.message
            : 'No se pudo cargar el inventario. Intenta de nuevo.',
        )
      })
      .finally(() => {
        if (vigente) setLoading(false)
      })
    return () => {
      vigente = false
    }
  }, [])

  return { equipos, setEquipos, loading, error, reintentar }
}
