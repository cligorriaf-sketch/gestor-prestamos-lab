import { useMemo, useState } from 'react'
import ListaEquipos from '../components/ListaEquipos'
import type { Equipo } from '../types'

interface InventarioProps {
  equipos: Equipo[]
  onPrestar: (id: number) => void
  disabled: boolean
}

function Inventario({ equipos, onPrestar, disabled }: InventarioProps) {
  const [categoria, setCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')

  const categorias = useMemo(
    () => ['Todas', ...new Set(equipos.map((equipo) => equipo.categoria))],
    [equipos],
  )
  const equiposFiltrados = equipos.filter((equipo) => {
    const coincideCategoria =
      categoria === 'Todas' || equipo.categoria === categoria
    const coincideNombre = equipo.nombre
      .toLocaleLowerCase()
      .includes(busqueda.trim().toLocaleLowerCase())
    return coincideCategoria && coincideNombre
  })

  const disponibles = equipos.filter((equipo) => equipo.disponible).length

  return (
    <section aria-labelledby="inventory-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">EQUIPO DEL LABORATORIO</p>
          <h2 id="inventory-title">Inventario</h2>
          <p className="section-description">
            Consulta el equipo y registra un nuevo préstamo.
          </p>
        </div>
        <div className="inventory-summary">
          <span className="summary-dot" />
          {disponibles} disponibles
        </div>
      </div>

      <div className="filter-bar">
        <label className="search-control">
          <span className="visually-hidden">Buscar equipo por nombre</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.2 4.2" />
          </svg>
          <input
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar equipo..."
          />
        </label>
        <label className="category-control">
          <span>Categoría</span>
          <select
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
          >
            {categorias.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="results-count">
        {equiposFiltrados.length}{' '}
        {equiposFiltrados.length === 1 ? 'equipo' : 'equipos'}
      </p>
      <ListaEquipos equipos={equiposFiltrados} onPrestar={onPrestar} />
      {disabled && <p className="visually-hidden">Guardando préstamo</p>}
    </section>
  )
}

export default Inventario
