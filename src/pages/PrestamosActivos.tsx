import TablaPrestamos from '../components/TablaPrestamos'
import type { Equipo, Prestamo } from '../types'
import { contarPrestamosVencidos } from '../utils/fechas'

interface PrestamosActivosProps {
  equipos: Equipo[]
  prestamos: Prestamo[]
  onDevolver: (prestamo: Prestamo) => void
  disabled: boolean
}

function PrestamosActivos({
  equipos,
  prestamos,
  onDevolver,
  disabled,
}: PrestamosActivosProps) {
  const vencidos = contarPrestamosVencidos(prestamos)

  return (
    <section aria-labelledby="loans-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">SEGUIMIENTO DE DEVOLUCIONES</p>
          <h2 id="loans-title">Préstamos activos</h2>
          <p className="section-description">
            Administra las entregas pendientes del laboratorio.
          </p>
        </div>
        <div className={vencidos > 0 ? 'inventory-summary summary-warning' : 'inventory-summary'}>
          <span className="summary-dot" />
          {vencidos} vencidos
        </div>
      </div>
      <TablaPrestamos
        equipos={equipos}
        prestamos={prestamos}
        onDevolver={onDevolver}
        disabled={disabled}
      />
    </section>
  )
}

export default PrestamosActivos
