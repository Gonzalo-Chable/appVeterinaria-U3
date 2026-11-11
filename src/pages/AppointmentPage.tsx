import { useEffect, useRef, useState } from "react";
import { AppointmentCard } from "../components/AppointmentCard";
import { AppointmentForm } from "../components/AppointmentForm";
import { StatCard } from "../components/StatCard";
import {
  actualizarEstado, obtenerCitas, registrarCita,
} from "../services/citasApi";

import type { Cita, EstadoCita, NuevaCita } from "../types";

type Filtro = "todas" | EstadoCita;

export function AppointmentsPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const nuevaCitaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function cargarCitas() {
      try {
        setCargando(true);
        setCitas(await obtenerCitas());
      } catch (error) {
        setError(error instanceof Error ? error.message : "Ocurrió un error.");
      } finally {
        setCargando(false);
      }
    }

    void cargarCitas();
  }, []);

  async function confirmarCita(id: number) {
    setError("");
    setMensaje("");
    try {
      const actualizada = await actualizarEstado(id, "confirmada");
      setCitas((actuales) =>
        actuales.map((cita) => (cita.id === id ? actualizada : cita)),
      );
      setMensaje(`Cita de ${actualizada.mascota} confirmada correctamente.`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al confirmar.");
    }
  }

  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [mensaje, setMensaje] = useState("");

  function cerrarFormulario() {
    setFormularioAbierto(false);
    nuevaCitaRef.current?.focus();
  }

  async function guardarCita(datos: NuevaCita) {
    const nueva = await registrarCita(datos);
    setCitas((actuales) => [...actuales, nueva].sort((a, b) =>
      `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`),
    ));
    setFiltro("todas");
    setError("");
    setMensaje(`Cita de ${nueva.mascota} registrada correctamente.`);
    cerrarFormulario();
  }

  const citasFiltradas =
    filtro === "todas" ? citas : citas.filter((cita) => cita.estado === filtro);

  const pendientes = citas.filter((c) => c.estado === "solicitada").length;
  const confirmadas = citas.filter((c) => c.estado === "confirmada").length;

 
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-950">Agenda de citas</h2>
          <p className="mt-1 text-slate-600">
            Consulta, registra y confirma las citas de la veterinaria.
          </p>
        </div>
        <button ref={nuevaCitaRef} type="button" aria-expanded={formularioAbierto} aria-controls="formulario-cita"
          onClick={() => { setFormularioAbierto(true); setMensaje(""); }}
          className="min-h-11 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200">
          + Nueva cita
        </button>
      </section>

      {formularioAbierto && <AppointmentForm onGuardar={guardarCita} onCancelar={cerrarFormulario} />}

      <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          titulo="Citas registradas"
          valor={citas.length}
          color="text-teal-700"
        />
        <StatCard
          titulo="Pendientes"
          valor={pendientes}
          color="text-amber-600"
        />
        <StatCard
          titulo="Confirmadas"
          valor={confirmadas}
          color="text-green-600"
        />
      </section>

      <section className="mt-8">
        <label
          htmlFor="filtro"
          className="mb-2 block font-semibold text-slate-700"
        >
          Filtrar por estado
        </label>
        <select
          id="filtro"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as Filtro)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 sm:w-64"
        >
          <option value="todas">Todas</option>
          <option value="solicitada">Solicitadas</option>
          <option value="confirmada">Confirmadas</option>
          <option value="atendida">Atendidas</option>
          <option value="rechazada">Rechazadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </section>

      {mensaje && (
        <p
          aria-live="polite"
          className="mt-6 rounded-xl bg-green-100 px-4 py-3 text-green-800"
        >
          {mensaje}
        </p>
      )}

      {error && <p role="alert" className="mt-6 rounded-xl bg-red-100 p-4 text-red-900">{error}</p>}

      <section className="mt-6 grid gap-4">
        {cargando ? <p role="status" className="p-5 text-slate-600">Cargando citas…</p> : citasFiltradas.length > 0 ? (
          citasFiltradas.map((cita) => (
            <AppointmentCard
              key={cita.id}
              cita={cita}
              onConfirmar={confirmarCita}
            />
          ))
        ) : !error && (
          <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
            No se encontraron citas con ese estado.
          </p>
        )}
      </section>
    </main>
  );
}
