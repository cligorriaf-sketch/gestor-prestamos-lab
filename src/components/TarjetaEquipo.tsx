import type { Equipo } from '../types'

export interface TarjetaEquipoProps {
  equipo: Equipo
  onPrestar: (id: number) => void
}

const iconos: Record<string, string> = {
  Monitor: '▣',
  Teclado: '⌨',
  Mouse: '⌖',
}

function TarjetaEquipo({ equipo, onPrestar }: TarjetaEquipoProps) {
  return (
    <article className="equipment-card">
      <div className="equipment-card-top">
        <div className="equipment-icon" aria-hidden="true">
          {iconos[equipo.categoria] ?? '▣'}
        </div>
        <span
          className={
            equipo.disponible
              ? 'status-badge status-available'
              : 'status-badge status-loaned'
          }
        >
          <span className="status-dot" />
          {equipo.disponible ? 'Disponible' : 'Prestado'}
        </span>
      </div>
      <div className="equipment-details">
        <p className="equipment-category">{equipo.categoria}</p>
        <h3>{equipo.nombre}</h3>
      </div>
      <button
        className="button button-primary equipment-action"
        type="button"
        disabled={!equipo.disponible}
        onClick={() => onPrestar(equipo.id)}
      >
        {equipo.disponible ? 'Prestar equipo' : 'No disponible'}
        {equipo.disponible && <span aria-hidden="true">→</span>}
      </button>
    </article>
  )
}

export default TarjetaEquipo
