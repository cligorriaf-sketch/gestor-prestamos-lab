import { useEffect, useRef, useState } from 'react'
import Encabezado from './components/Encabezado'
import FormularioPrestamo from './components/FormularioPrestamo'
import type { FormularioPrestamoDatos } from './components/FormularioPrestamo'
import { useEquipos } from './hooks/useEquipos'
import Inventario from './pages/Inventario'
import PrestamosActivos from './pages/PrestamosActivos'
import {
  actualizarEquipo,
  actualizarPrestamo,
  crearPrestamo,
  obtenerPrestamosActivos,
} from './services/api'
import type { Equipo, Prestamo } from './types'
import './App.css'

type Vista = 'inventario' | 'prestamos'

const TITULO_APLICACION = 'Préstamos Lab — 0902-22-7467'

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado. Intenta de nuevo.'
}

function App() {
  const {
    equipos,
    setEquipos,
    loading: equiposLoading,
    error: equiposError,
    reintentar: reintentarEquipos,
  } = useEquipos()
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [prestamosLoading, setPrestamosLoading] = useState(true)
  const [prestamosError, setPrestamosError] = useState<string | null>(null)
  const [vista, setVista] = useState<Vista>('inventario')
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(
    null,
  )
  const [enviando, setEnviando] = useState(false)
  const [errorOperacion, setErrorOperacion] = useState<string | null>(null)
  const envioEnCurso = useRef(false)

  useEffect(() => {
    document.title = TITULO_APLICACION
  }, [])

  async function cargarPrestamos() {
    try {
      setPrestamos(await obtenerPrestamosActivos())
    } catch (error) {
      setPrestamosError(obtenerMensajeError(error))
    } finally {
      setPrestamosLoading(false)
    }
  }

  async function reintentarPrestamos() {
    setPrestamosLoading(true)
    setPrestamosError(null)
    await cargarPrestamos()
  }

  useEffect(() => {
    let vigente = true
    obtenerPrestamosActivos()
      .then((datos) => {
        if (vigente) setPrestamos(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setPrestamosError(obtenerMensajeError(error))
      })
      .finally(() => {
        if (vigente) setPrestamosLoading(false)
      })
    return () => {
      vigente = false
    }
  }, [])

  async function reintentarCarga() {
    await Promise.all([reintentarEquipos(), reintentarPrestamos()])
  }

  async function registrarPrestamo(datos: FormularioPrestamoDatos) {
    if (envioEnCurso.current || !equipoSeleccionado) return
    envioEnCurso.current = true
    setEnviando(true)
    setErrorOperacion(null)

    const equipo = equipoSeleccionado
    let prestamoCreado: Prestamo | null = null

    try {
      prestamoCreado = await crearPrestamo({
        equipoId: equipo.id,
        solicitante: datos.solicitante.trim(),
        carne: datos.carne.trim(),
        fechaPrestamo: new Date().toISOString(),
        fechaLimite: `${datos.fechaLimite}T12:00:00.000Z`,
        devuelto: false,
      })

      try {
        await actualizarEquipo(equipo.id, { disponible: false })
      } catch (error) {
        try {
          await actualizarPrestamo(prestamoCreado.id, { devuelto: true })
        } catch (errorRollback) {
          throw new Error(
            `${obtenerMensajeError(error)} No se pudo revertir el préstamo creado: ${obtenerMensajeError(errorRollback)}`,
          )
        }
        throw error
      }

      setPrestamos((actuales) => [prestamoCreado!, ...actuales])
      setEquipos((actuales) =>
        actuales.map((actual) =>
          actual.id === equipo.id ? { ...actual, disponible: false } : actual,
        ),
      )
      setEquipoSeleccionado(null)
    } catch (error) {
      setErrorOperacion(obtenerMensajeError(error))
      if (prestamoCreado) {
        await Promise.all([reintentarEquipos(), reintentarPrestamos()])
      }
    } finally {
      envioEnCurso.current = false
      setEnviando(false)
    }
  }

  async function devolverPrestamo(prestamo: Prestamo) {
    if (envioEnCurso.current) return
    envioEnCurso.current = true
    setEnviando(true)
    setErrorOperacion(null)

    try {
      await actualizarPrestamo(prestamo.id, { devuelto: true })
      try {
        await actualizarEquipo(prestamo.equipoId, { disponible: true })
      } catch (error) {
        try {
          await actualizarPrestamo(prestamo.id, { devuelto: false })
        } catch (errorRollback) {
          throw new Error(
            `${obtenerMensajeError(error)} No se pudo revertir el estado del préstamo: ${obtenerMensajeError(errorRollback)}`,
          )
        }
        throw error
      }

      setPrestamos((actuales) =>
        actuales.filter((actual) => actual.id !== prestamo.id),
      )
      setEquipos((actuales) =>
        actuales.map((equipo) =>
          equipo.id === prestamo.equipoId
            ? { ...equipo, disponible: true }
            : equipo,
        ),
      )
    } catch (error) {
      setErrorOperacion(obtenerMensajeError(error))
      await Promise.all([reintentarEquipos(), reintentarPrestamos()])
    } finally {
      envioEnCurso.current = false
      setEnviando(false)
    }
  }

  const errorCarga = equiposError ?? prestamosError
  const cargando = equiposLoading || prestamosLoading

  return (
    <main className="app-shell">
      <Encabezado
        titulo={TITULO_APLICACION}
        equipos={equipos}
        prestamos={prestamos}
      />

      <nav className="main-nav" aria-label="Vistas principales">
        <button
          className={vista === 'inventario' ? 'nav-tab active' : 'nav-tab'}
          type="button"
          onClick={() => setVista('inventario')}
        >
          Inventario
        </button>
        <button
          className={vista === 'prestamos' ? 'nav-tab active' : 'nav-tab'}
          type="button"
          onClick={() => setVista('prestamos')}
        >
          Préstamos activos
          {prestamos.length > 0 && (
            <span className="nav-count">{prestamos.length}</span>
          )}
        </button>
      </nav>

      {errorCarga && (
        <section className="notice notice-error" role="alert">
          <div>
            <strong>No se pudieron cargar los datos</strong>
            <p>{errorCarga}</p>
          </div>
          <button className="button button-secondary" onClick={reintentarCarga}>
            Reintentar
          </button>
        </section>
      )}

      {errorOperacion && (
        <section className="notice notice-error" role="alert">
          <div>
            <strong>No se completó la operación</strong>
            <p>{errorOperacion}</p>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Cerrar mensaje"
            onClick={() => setErrorOperacion(null)}
          >
            ×
          </button>
        </section>
      )}

      {cargando ? (
        <div className="loading-state" role="status">
          <span className="spinner" />
          Cargando inventario y préstamos…
        </div>
      ) : (
        <div className="page-content">
          {vista === 'inventario' ? (
            <Inventario
              equipos={equipos}
              onPrestar={(id) => {
                const equipo = equipos.find((item) => item.id === id)
                if (equipo) setEquipoSeleccionado(equipo)
              }}
              disabled={enviando}
            />
          ) : (
            <PrestamosActivos
              equipos={equipos}
              prestamos={prestamos}
              onDevolver={devolverPrestamo}
              disabled={enviando}
            />
          )}
        </div>
      )}

      {equipoSeleccionado && (
        <FormularioPrestamo
          equipo={equipoSeleccionado}
          enviando={enviando}
          onCancelar={() => setEquipoSeleccionado(null)}
          onGuardar={registrarPrestamo}
        />
      )}
    </main>
  )
}

export default App
