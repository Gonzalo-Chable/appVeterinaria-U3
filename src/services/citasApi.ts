import type { Cita, EstadoCita, NuevaCita } from "../types";

const API_URL = "http://localhost:3000/api/citas";

async function solicitar(ruta = "", opciones?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_URL}${ruta}`, opciones);
  } catch {
    throw new Error("No se pudo conectar con el servidor. Comprueba que el backend esté encendido.");
  }
}

export async function obtenerCitas(): Promise<Cita[]> {
  const respuesta = await solicitar();
  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.mensaje ?? "No fue posible consultar las citas.");
  return resultado;
}

export async function actualizarEstado(
  id: number, estado: EstadoCita,
): Promise<Cita> {
  const respuesta = await solicitar(`/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });

  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.mensaje);
  return resultado.cita;
}

export async function registrarCita(datos: NuevaCita): Promise<Cita> {
  const respuesta = await solicitar("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.mensaje ?? "No fue posible registrar la cita.");
  return resultado.cita;
}
