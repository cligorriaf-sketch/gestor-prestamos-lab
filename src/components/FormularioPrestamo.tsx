import { useState, type FormEvent } from 'react'
import { addCalendarDays, fechaLocalHoy } from '../utils/fechas'
import type { Equipo } from '../types'

export interface FormularioPrestamoDatos {
  solicitante: string
  carne: string
  fechaLimite: string
}

interface FormularioPrestamoProps {
  equipo: Equipo
  enviando: boolean
  onCancelar: () => void
  onGuardar: (datos: FormularioPrestamoDatos) => Promise<void>
}

interface ErroresFormulario {
  solicitante?: string
  carne?: string
  fechaLimite?: string
}

const PATRON_CARNE = /^\d{4}-\d{2}-\d{5}$/
const MAXIMO_DIAS_PRESTAMO = 5

function FormularioPrestamo({
  equipo,
  enviando,
  onCancelar,
  onGuardar,
}: FormularioPrestamoProps) {
  const hoy = fechaLocalHoy()
  const fechaMaxima = addCalendarDays(hoy, MAXIMO_DIAS_PRESTAMO)
  const [solicitante, setSolicitante] = useState('')
  const [carne, setCarne] = useState('')
  const [fechaLimite, setFechaLimite] = useState('')
  const [errores, setErrores] = useState<ErroresFormulario>({})

  function validar(): ErroresFormulario {
    const nuevosErrores: ErroresFormulario = {}
    if (solicitante.trim().length < 5) {
      nuevosErrores.solicitante =
        'Escribe el nombre del solicitante (mínimo 5 caracteres).'
    }
    if (!PATRON_CARNE.test(carne.trim())) {
      nuevosErrores.carne = 'Usa el formato 0000-00-00000.'
    }
    if (!fechaLimite) {
      nuevosErrores.fechaLimite = 'Selecciona una fecha límite.'
    } else if (fechaLimite < hoy) {
      nuevosErrores.fechaLimite = 'La fecha no puede ser anterior a hoy.'
    } else if (fechaLimite > fechaMaxima) {
      nuevosErrores.fechaLimite = `El máximo permitido es ${MAXIMO_DIAS_PRESTAMO} días.`
    }
    return nuevosErrores
  }

  async function manejarEnvio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const erroresValidados = validar()
    setErrores(erroresValidados)
    if (Object.keys(erroresValidados).length > 0) return
    await onGuardar({ solicitante, carne, fechaLimite })
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="loan-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">NUEVO PRÉSTAMO · {equipo.categoria}</p>
            <h2 id="form-title">Registrar préstamo</h2>
            <p className="modal-equipment">{equipo.nombre}</p>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onCancelar}
            disabled={enviando}
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </div>
        <form className="loan-form" onSubmit={manejarEnvio} noValidate>
          <label htmlFor="solicitante">Nombre del solicitante</label>
          <input
            id="solicitante"
            autoFocus
            value={solicitante}
            onChange={(event) => setSolicitante(event.target.value)}
            aria-invalid={Boolean(errores.solicitante)}
            aria-describedby={
              errores.solicitante ? 'solicitante-error' : undefined
            }
            placeholder="Nombre y apellido"
            disabled={enviando}
          />
          {errores.solicitante && (
            <span className="field-error" id="solicitante-error">
              {errores.solicitante}
            </span>
          )}

          <label htmlFor="carne">Carné</label>
          <input
            id="carne"
            value={carne}
            onChange={(event) => setCarne(event.target.value)}
            aria-invalid={Boolean(errores.carne)}
            aria-describedby={errores.carne ? 'carne-error' : undefined}
            placeholder="0000-00-00000"
            inputMode="numeric"
            disabled={enviando}
          />
          {errores.carne && (
            <span className="field-error" id="carne-error">
              {errores.carne}
            </span>
          )}

          <label htmlFor="fecha-limite">Fecha límite de devolución</label>
          <input
            id="fecha-limite"
            type="date"
            value={fechaLimite}
            min={hoy}
            max={fechaMaxima}
            onChange={(event) => setFechaLimite(event.target.value)}
            aria-invalid={Boolean(errores.fechaLimite)}
            aria-describedby={
              errores.fechaLimite ? 'fecha-error' : 'fecha-ayuda'
            }
            disabled={enviando}
          />
          {errores.fechaLimite ? (
            <span className="field-error" id="fecha-error">
              {errores.fechaLimite}
            </span>
          ) : (
            <span className="field-hint" id="fecha-ayuda">
              Máximo 5 días a partir de hoy.
            </span>
          )}

          <div className="modal-actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={onCancelar}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              className="button button-primary"
              type="submit"
              disabled={enviando}
            >
              {enviando ? 'Guardando…' : 'Confirmar préstamo'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default FormularioPrestamo
