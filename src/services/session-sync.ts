import { useProcessStore } from "@/stores/use-process-store";
import { useWindowStore } from "@/stores/use-window-store";
import { appRegistry } from "@/apps/_registry";
import { BASE_URL } from "@/constants/app";
import { getToken } from "@/services/api/client";
import {
  fetchSession,
  saveSession,
  deleteSession,
} from "@/services/api/session-service";
import type { SessionData } from "@/services/api/session-service";
import type { ProcessState, WindowState } from "@/types";

const SYNC_INTERVAL_MS = 10_000;

let syncTimer: ReturnType<typeof setInterval> | null = null;
let isSyncing = false;

// ── Holatni olish ──

function captureSnapshot(): SessionData {
  const { processes } = useProcessStore.getState();
  const { windows, nextZIndex, windowProps } = useWindowStore.getState();

  return {
    processes,
    windows,
    windowProps,
    nextZIndex,
  };
}

// ── Backendga yuborish ──

async function syncToBackend(): Promise<void> {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const snapshot = captureSnapshot();
    if (snapshot.processes.length === 0 && snapshot.windows.length === 0) {
      await deleteSession();
      return;
    }
    await saveSession(snapshot);
  } catch (err) {
    console.warn("[session-sync] Sync xatolik:", err);
  } finally {
    isSyncing = false;
  }
}

// ── Sessiyani tiklash ──

function filterValidSession(session: SessionData): SessionData {
  const validAppIds = new Set(Object.keys(appRegistry));

  const validProcesses = session.processes.filter((p: ProcessState) =>
    validAppIds.has(p.appId),
  );
  const validProcessIds = new Set(
    validProcesses.map((p: ProcessState) => p.id),
  );

  const validWindows = session.windows.filter(
    (w: WindowState) =>
      validAppIds.has(w.appId) && validProcessIds.has(w.processId),
  );
  const validWindowIds = new Set(
    validWindows.map((w: WindowState) => w.id),
  );

  const validWindowProps: Record<string, Record<string, unknown>> = {};
  for (const [windowId, props] of Object.entries(session.windowProps)) {
    if (validWindowIds.has(windowId)) {
      validWindowProps[windowId] = props;
    }
  }

  return {
    ...session,
    processes: validProcesses,
    windows: validWindows,
    windowProps: validWindowProps,
  };
}

export async function restoreSession(): Promise<boolean> {
  try {
    const session = await fetchSession();
    if (!session) return false;

    const filtered = filterValidSession(session);
    if (filtered.processes.length === 0) return false;

    useProcessStore.getState().restoreProcesses(filtered.processes);
    useWindowStore
      .getState()
      .restoreWindows(
        filtered.windows,
        filtered.windowProps,
        filtered.nextZIndex,
      );

    return true;
  } catch (err) {
    console.warn("[session-sync] Tiklash xatolik:", err);
    return false;
  }
}

// ── Lifecycle ──

function handleBeforeUnload(): void {
  const snapshot = captureSnapshot();
  if (snapshot.processes.length === 0 && snapshot.windows.length === 0) return;

  const token = getToken();

  try {
    fetch(`${BASE_URL}/api/v1/session`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        processes: snapshot.processes,
        windows: snapshot.windows,
        windowProps: snapshot.windowProps,
        nextZIndex: snapshot.nextZIndex,
      }),
      keepalive: true,
    });
  } catch {
    // Best effort — brauzer yopilayotganda xatolik bo'lishi mumkin
  }
}

export function startSessionSync(): void {
  if (syncTimer !== null) return;

  syncTimer = setInterval(syncToBackend, SYNC_INTERVAL_MS);
  window.addEventListener("beforeunload", handleBeforeUnload);
}

export function stopSessionSync(): void {
  if (syncTimer !== null) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
  window.removeEventListener("beforeunload", handleBeforeUnload);
}
