import type { Equipo, Prestamo } from '../types'
import { contarPrestamosVencidos } from '../utils/fechas'

interface EncabezadoProps {
  titulo: string
  equipos: Equipo[]
  prestamos: Prestamo[]
}

function Encabezado({ titulo, equipos, prestamos }: EncabezadoProps) {
  const disponibles = equipos.filter((equipo) => equipo.disponible).length
  const vencidos = contarPrestamosVencidos(prestamos)

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <path
              d="M8 7.5h16A2.5 2.5 0 0 1 26.5 10v12a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 22V10A2.5 2.5 0 0 1 8 7.5Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M11 14h10M11 18h6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <p className="eyebrow">CENTRO UNIVERSITARIO · LABORATORIO</p>
          <h1>{titulo}</h1>
          <p className="header-subtitle">
            Control de inventario y préstamos de equipo
          </p>
        </div>
      </div>
      <div className="header-metrics">
        <div className="metric-card">
          <span className="metric-value">{disponibles}</span>
          <span className="metric-label">
            de {equipos.length} equipos disponibles
          </span>
        </div>
        <div className="metric-card overdue-metric">
          <span className="metric-value">{vencidos}</span>
          <span className="metric-label">préstamos vencidos</span>
        </div>
      </div>
    </header>
  )
}

export default Encabezado
