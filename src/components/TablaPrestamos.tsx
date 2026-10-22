import type { Equipo, Prestamo } from '../types'
import { esFechaVencida, formatearFecha } from '../utils/fechas'

interface TablaPrestamosProps {
  equipos: Equipo[]
  prestamos: Prestamo[]
  onDevolver: (prestamo: Prestamo) => void
  disabled: boolean
}

function TablaPrestamos({
  equipos,
  prestamos,
  onDevolver,
  disabled,
}: TablaPrestamosProps) {
  if (prestamos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">
          ✓
        </span>
        <h3>Todo el equipo está al día</h3>
        <p>No hay préstamos activos en este momento.</p>
      </div>
    )
  }

  const prestamosOrdenados = [...prestamos].sort(
    (a, b) => a.fechaLimite.localeCompare(b.fechaLimite),
  )

  return (
    <div className="table-wrap">
      <table className="loans-table">
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Solicitante</th>
            <th>Carné</th>
            <th>Fecha límite</th>
            <th>Estado</th>
            <th aria-label="Acciones" />
          </tr>
        </thead>
        <tbody>
          {prestamosOrdenados.map((prestamo) => {
            const equipo = equipos.find(
              (item) => item.id === prestamo.equipoId,
            )
            const vencido = esFechaVencida(prestamo.fechaLimite)

            return (
              <tr
                className={vencido ? 'loan-row overdue-row' : 'loan-row'}
                key={prestamo.id}
              >
                <td>
                  <div className="table-equipment">
                    <span className="table-equipment-icon" aria-hidden="true">
                      {equipo?.categoria === 'Mouse'
                        ? '⌖'
                        : equipo?.categoria === 'Teclado'
                          ? '⌨'
                          : '▣'}
                    </span>
                    <span>
                      <strong>{equipo?.nombre ?? 'Equipo no encontrado'}</strong>
                      <small>{equipo?.categoria ?? '—'}</small>
                    </span>
                  </div>
                </td>
                <td>{prestamo.solicitante}</td>
                <td className="table-carne">{prestamo.carne}</td>
                <td>{formatearFecha(prestamo.fechaLimite)}</td>
                <td>
                  <span
                    className={
                      vencido
                        ? 'status-badge status-loaned'
                        : 'status-badge status-available'
                    }
                  >
                    <span className="status-dot" />
                    {vencido ? 'Vencido' : 'En tiempo'}
                  </span>
                </td>
                <td className="table-action">
                  <button
                    className="button button-return"
                    type="button"
                    onClick={() => onDevolver(prestamo)}
                    disabled={disabled}
                  >
                    Devolver
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TablaPrestamos
