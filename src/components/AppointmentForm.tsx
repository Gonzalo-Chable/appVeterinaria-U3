import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { NuevaCita } from "../types";

type Props = {
  onGuardar: (datos: NuevaCita) => Promise<void>;
  onCancelar: () => void;
};

const estiloCampo = "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-200";

export function AppointmentForm({ onGuardar, onCancelar }: Props) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const mascotaRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => { mascotaRef.current?.focus(); }, []);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (guardando) return;
    const formulario = new FormData(event.currentTarget);
    const datos: NuevaCita = {
      mascota: String(formulario.get("mascota") ?? "").trim(),
      cliente: String(formulario.get("cliente") ?? "").trim(),
      servicio: String(formulario.get("servicio") ?? "").trim(),
      fecha: String(formulario.get("fecha") ?? ""),
      hora: String(formulario.get("hora") ?? ""),
    };

    setError("");
    setGuardando(true);
    try {
      await onGuardar(datos);
    } catch (error) {
      setError(error instanceof Error ? error.message : "No fue posible registrar la cita.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section id="formulario-cita" aria-labelledby="titulo-nueva-cita" className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
      <h3 id="titulo-nueva-cita" className="text-xl font-bold text-slate-950">Nueva cita</h3>
      <p id="ayuda-nueva-cita" className="mt-1 text-sm text-slate-600">Completa todos los campos. La cita se registrará como solicitada.</p>
      <form onSubmit={guardar} aria-describedby="ayuda-nueva-cita" className="mt-5">
        {error && <p ref={errorRef} role="alert" tabIndex={-1} className="mb-5 rounded-xl bg-red-100 p-4 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-600">{error}</p>}
        <fieldset disabled={guardando} className="grid min-w-0 gap-4 sm:grid-cols-2 disabled:opacity-75">
          <legend className="sr-only">Datos de la nueva cita</legend>
          <label htmlFor="mascota" className="min-w-0 text-sm font-semibold text-slate-700">
            Mascota
            <input ref={mascotaRef} id="mascota" name="mascota" type="text" required maxLength={80} pattern=".*\S.*" title="Escribe el nombre de la mascota." className={estiloCampo} />
          </label>
          <label htmlFor="cliente" className="min-w-0 text-sm font-semibold text-slate-700">
            Cliente
            <input id="cliente" name="cliente" type="text" required maxLength={120} pattern=".*\S.*" title="Escribe el nombre del cliente." className={estiloCampo} />
          </label>
          <label htmlFor="servicio" className="min-w-0 text-sm font-semibold text-slate-700 sm:col-span-2">
            Servicio
            <input id="servicio" name="servicio" type="text" required maxLength={120} pattern=".*\S.*" title="Escribe el servicio solicitado." className={estiloCampo} />
          </label>
          <label htmlFor="fecha" className="min-w-0 text-sm font-semibold text-slate-700">
            Fecha
            <input id="fecha" name="fecha" type="date" required min="1000-01-01" max="9999-12-31" className={estiloCampo} />
          </label>
          <label htmlFor="hora" className="min-w-0 text-sm font-semibold text-slate-700">
            Hora
            <input id="hora" name="hora" type="time" required className={estiloCampo} />
          </label>
          <div className="mt-2 flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onCancelar} className="min-h-11 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-teal-200">Cancelar</button>
            <button type="submit" className="min-h-11 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200">{guardando ? "Guardando…" : "Guardar cita"}</button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
