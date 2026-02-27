import type { ProcessState, WindowState } from "@/types";
import { apiDelete, apiGet, apiPut } from "./client";

// ── Backend DTO (snake_case top-level) ──

interface SessionDTO {
  processes: ProcessState[];
  windows: WindowState[];
  window_props: Record<string, Record<string, unknown>>;
  next_z_index: number;
  extra: Record<string, unknown> | null;
  updated_at: string;
}

// ── Frontend type ──

export interface SessionData {
  processes: ProcessState[];
  windows: WindowState[];
  windowProps: Record<string, Record<string, unknown>>;
  nextZIndex: number;
}

// ── DTO mapping ──

function mapSessionDTO(dto: SessionDTO): SessionData {
  return {
    processes: dto.processes,
    windows: dto.windows,
    windowProps: dto.window_props,
    nextZIndex: dto.next_z_index,
  };
}

// ── API funksiyalari ──

export async function fetchSession(): Promise<SessionData | null> {
  try {
    const dto = await apiGet<SessionDTO>("/session");
    return mapSessionDTO(dto);
  } catch {
    return null;
  }
}

export async function saveSession(data: SessionData): Promise<void> {
  await apiPut("/session", {
    processes: data.processes,
    windows: data.windows,
    windowProps: data.windowProps,
    nextZIndex: data.nextZIndex,
  });
}

export async function deleteSession(): Promise<void> {
  await apiDelete("/session");
}
