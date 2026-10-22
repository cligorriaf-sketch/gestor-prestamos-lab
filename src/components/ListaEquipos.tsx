import TarjetaEquipo from './TarjetaEquipo'
import type { Equipo } from '../types'

interface ListaEquiposProps {
  equipos: Equipo[]
  onPrestar: (id: number) => void
}

function ListaEquipos({ equipos, onPrestar }: ListaEquiposProps) {
  if (equipos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">
          ⌕
        </span>
        <h3>No encontramos equipos</h3>
        <p>Prueba con otra búsqueda o categoría.</p>
      </div>
    )
  }

  return (
    <div className="equipment-grid">
      {equipos.map((equipo) => (
        <TarjetaEquipo
          key={equipo.id}
          equipo={equipo}
          onPrestar={onPrestar}
        />
      ))}
    </div>
  )
}

export default ListaEquipos
