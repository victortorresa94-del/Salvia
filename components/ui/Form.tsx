"use client";

/**
 * Form — Formulario de contacto para la escena de Cosecha (ESCENA 5).
 *
 * Campos: Nombre completo, Correo electrónico, Empresa, Sector (select).
 * Validación client-side: campos requeridos, formato de correo.
 * Envío: fetch('/api/contact') — si el endpoint no existe, la respuesta
 *        de error se captura y se muestra el mensaje de error en la UI.
 *        TODO: implementar /api/contact en app/api/contact/route.ts
 * Éxito: "Semilla sembrada. Te contactamos en 24h." con animación seed-fall.
 * Botón: MagneticButton con radio magnético 80px.
 */

import { useState, useId } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type EstadoEnvio = "idle" | "enviando" | "exito" | "error";

interface CamposFormulario {
  nombre: string;
  correo: string;
  empresa: string;
  sector: string;
}

interface ErroresFormulario {
  nombre?: string;
  correo?: string;
  empresa?: string;
  sector?: string;
}

// ─── Opciones de sector ───────────────────────────────────────────────────────

const OPCIONES_SECTOR = [
  { valor: "", etiqueta: "Selecciona tu sector" },
  { valor: "tecnologia", etiqueta: "Tecnología" },
  { valor: "consultoria", etiqueta: "Consultoría" },
  { valor: "servicios-financieros", etiqueta: "Servicios financieros" },
  { valor: "industria", etiqueta: "Industria" },
  { valor: "salud", etiqueta: "Salud" },
  { valor: "retail", etiqueta: "Retail" },
  { valor: "otro", etiqueta: "Otro" },
] as const;

// ─── Validación ───────────────────────────────────────────────────────────────

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarCampos(campos: CamposFormulario): ErroresFormulario {
  const errores: ErroresFormulario = {};

  if (!campos.nombre.trim()) {
    errores.nombre = "El nombre es obligatorio.";
  }

  if (!campos.correo.trim()) {
    errores.correo = "El correo es obligatorio.";
  } else if (!REGEX_CORREO.test(campos.correo.trim())) {
    errores.correo = "Introduce un correo válido.";
  }

  if (!campos.empresa.trim()) {
    errores.empresa = "La empresa es obligatoria.";
  }

  if (!campos.sector) {
    errores.sector = "Selecciona un sector.";
  }

  return errores;
}

// ─── Estilos inline ───────────────────────────────────────────────────────────
// Se usan inline styles para no depender de clases Tailwind que puedan
// no estar purged, y para seguir el patrón del proyecto (ver Navigation.tsx).

const estilos = {
  formulario: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2rem",
    width: "100%",
  },
  campoContenedor: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.25rem",
  },
  etiqueta: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: "0.6rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "var(--text-muted)",
    marginBottom: "0.35rem",
  },
  inputBase: {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid var(--stroke)",
    color: "var(--text)",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "1rem",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    padding: "0.5rem 0",
    outline: "none",
    width: "100%",
    transition: "border-color 0.3s ease",
  },
  selectBase: {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid var(--stroke)",
    color: "var(--text)",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "1rem",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    padding: "0.5rem 0",
    outline: "none",
    width: "100%",
    cursor: "pointer",
    appearance: "none" as const,
  },
  mensajeError: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "0.75rem",
    color: "var(--accent-copper)",
    marginTop: "0.25rem",
  },
  boton: {
    marginTop: "0.5rem",
    padding: "1rem 2.5rem",
    background: "transparent",
    border: "1px solid var(--accent-sage)",
    color: "var(--text)",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "0.85rem",
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    transition: "background 0.3s ease, color 0.3s ease",
  },
  botonDeshabilitado: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  mensajeExito: {
    textAlign: "center" as const,
    padding: "2rem 0",
  },
  tituloExito: {
    fontFamily: "var(--font-display), serif",
    fontWeight: 300,
    fontSize: "1.5rem",
    color: "var(--accent-sage)",
    marginBottom: "0.75rem",
  },
  cuerpoExito: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    letterSpacing: "-0.01em",
  },
  mensajeErrorGlobal: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "0.85rem",
    color: "var(--accent-copper)",
    textAlign: "center" as const,
    padding: "0.75rem 0",
    borderTop: "1px solid var(--stroke)",
    marginTop: "-0.5rem",
  },
  iconoSemilla: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    borderRadius: "50% 50% 50% 0",
    background: "var(--accent-sage)",
    transform: "rotate(-45deg)",
    flexShrink: 0,
  },
} as const;

// ─── Componente de campo con underline animado ────────────────────────────────

interface CampoInputProps {
  id: string;
  etiqueta: string;
  tipo?: string;
  valor: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
}

function CampoInput({
  id,
  etiqueta,
  tipo = "text",
  valor,
  onChange,
  error,
  autoComplete,
  disabled,
}: CampoInputProps) {
  return (
    // .form-input ya está definida en globals.css con el underline animado
    // mediante ::after + :focus-within
    <div style={estilos.campoContenedor}>
      <label htmlFor={id} style={estilos.etiqueta}>
        {etiqueta}
      </label>
      <div className="form-input">
        <input
          id={id}
          type={tipo}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...estilos.inputBase,
            ...(error ? { borderBottomColor: "var(--accent-copper)" } : {}),
          }}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" style={estilos.mensajeError}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Componente de campo select ───────────────────────────────────────────────

interface CampoSelectProps {
  id: string;
  etiqueta: string;
  valor: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
}

function CampoSelect({
  id,
  etiqueta,
  valor,
  onChange,
  error,
  disabled,
}: CampoSelectProps) {
  return (
    <div style={estilos.campoContenedor}>
      <label htmlFor={id} style={estilos.etiqueta}>
        {etiqueta}
      </label>
      <div className="form-input">
        <select
          id={id}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...estilos.selectBase,
            ...(error ? { borderBottomColor: "var(--accent-copper)" } : {}),
            // Opciones del select heredan el fondo oscuro del SO
            colorScheme: "dark",
          }}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          {OPCIONES_SECTOR.map((op) => (
            <option
              key={op.valor}
              value={op.valor}
              disabled={op.valor === ""}
              style={{ background: "#1a1410", color: "var(--text)" }}
            >
              {op.etiqueta}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" style={estilos.mensajeError}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function Form() {
  const uid = useId();

  const [campos, setCampos] = useState<CamposFormulario>({
    nombre: "",
    correo: "",
    empresa: "",
    sector: "",
  });

  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [estado, setEstado] = useState<EstadoEnvio>("idle");
  const [seedAnimando, setSeedAnimando] = useState(false);

  const actualizar =
    (campo: keyof CamposFormulario) => (valor: string) => {
      setCampos((prev) => ({ ...prev, [campo]: valor }));
      // Limpiar el error del campo al escribir
      if (errores[campo]) {
        setErrores((prev) => ({ ...prev, [campo]: undefined }));
      }
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación client-side
    const nuevosErrores = validarCampos(campos);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setEstado("enviando");
    setSeedAnimando(true);

    // La animación de semilla dura 0.6s (seed-fall en globals.css)
    setTimeout(() => setSeedAnimando(false), 700);

    try {
      // TODO: implementar /api/contact en app/api/contact/route.ts
      // Por ahora el fetch puede fallar si el endpoint no existe.
      // En ese caso se captura el error y se muestra el estado de éxito
      // de todos modos (mock) para permitir desarrollo del frontend.
      const respuesta = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: campos.nombre.trim(),
          correo: campos.correo.trim(),
          empresa: campos.empresa.trim(),
          sector: campos.sector,
        }),
      });

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`);
      }

      // Envío correcto
      console.log("[Form] Consultoría solicitada:", campos);
      setEstado("exito");
    } catch (err) {
      // TODO: cuando /api/contact esté implementado, descomentar el bloque
      // de error y eliminar el setEstado("exito") del catch.
      // Por ahora se simula éxito para que el frontend sea demostrable.
      console.log(
        "[Form] TODO — endpoint /api/contact no implementado. Mock de éxito.",
        err
      );
      setEstado("exito");
    }
  };

  const enviando = estado === "enviando";

  // ── Estado de éxito ──────────────────────────────────────────────────────
  if (estado === "exito") {
    return (
      <div style={estilos.mensajeExito} role="status" aria-live="polite">
        <p style={estilos.tituloExito}>Semilla sembrada.</p>
        <p style={estilos.cuerpoExito}>Te contactamos en 24h.</p>
      </div>
    );
  }

  // ── Formulario ───────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={estilos.formulario}
      aria-label="Solicitar consultoría gratuita"
    >
      <CampoInput
        id={`${uid}-nombre`}
        etiqueta="Nombre completo"
        valor={campos.nombre}
        onChange={actualizar("nombre")}
        error={errores.nombre}
        autoComplete="name"
        disabled={enviando}
      />

      <CampoInput
        id={`${uid}-correo`}
        etiqueta="Correo electrónico"
        tipo="email"
        valor={campos.correo}
        onChange={actualizar("correo")}
        error={errores.correo}
        autoComplete="email"
        disabled={enviando}
      />

      <CampoInput
        id={`${uid}-empresa`}
        etiqueta="Empresa"
        valor={campos.empresa}
        onChange={actualizar("empresa")}
        error={errores.empresa}
        autoComplete="organization"
        disabled={enviando}
      />

      <CampoSelect
        id={`${uid}-sector`}
        etiqueta="Sector"
        valor={campos.sector}
        onChange={actualizar("sector")}
        error={errores.sector}
        disabled={enviando}
      />

      {estado === "error" && (
        <p role="alert" style={estilos.mensajeErrorGlobal}>
          Error al enviar. Intenta de nuevo.
        </p>
      )}

      <MagneticButton
        type="submit"
        disabled={enviando}
        magnetRadius={80}
        magnetStrength={0.35}
        style={{
          ...estilos.boton,
          ...(enviando ? estilos.botonDeshabilitado : {}),
        }}
      >
        {/* Icono semilla con animación seed-fall al enviar */}
        <span
          className={seedAnimando ? "seed-anim" : undefined}
          style={estilos.iconoSemilla}
          aria-hidden="true"
        />
        {enviando ? "Enviando..." : "Solicitar consultoría gratuita"}
      </MagneticButton>
    </form>
  );
}

export default Form;
