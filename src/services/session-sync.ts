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
const DEBOUNCE_MS = 400;

let syncTimer: ReturnType<typeof setInterval> | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let unsubscribeStores: (() => void) | null = null;
let isSyncing = false;

// ── Capture state ──

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

// ── Send to backend ──

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
    console.warn("[session-sync] Sync error:", err);
  } finally {
    isSyncing = false;
  }
}

function debouncedSyncToBackend(): void {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    syncToBackend();
  }, DEBOUNCE_MS);
}

// ── Restore session ──

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
    console.warn("[session-sync] Restore error:", err);
    return false;
  }
}

// ── Lifecycle ──

function handleBeforeUnload(event: BeforeUnloadEvent): void {
  // Cancel pending debounce — beforeunload syncs itself
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  const snapshot = captureSnapshot();

  // If there are open processes — show browser warning dialog
  if (snapshot.processes.length > 0) {
    event.preventDefault();
  }

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
    // Best effort — may fail when browser is closing
  }
}

export function startSessionSync(): void {
  if (syncTimer !== null) return;

  syncTimer = setInterval(syncToBackend, SYNC_INTERVAL_MS);
  window.addEventListener("beforeunload", handleBeforeUnload);

  // Sync immediately when process or window count changes (with debounce)
  const unsubProcess = useProcessStore.subscribe((state, prevState) => {
    if (state.processes.length !== prevState.processes.length) {
      debouncedSyncToBackend();
    }
  });

  const unsubWindow = useWindowStore.subscribe((state, prevState) => {
    if (state.windows.length !== prevState.windows.length) {
      debouncedSyncToBackend();
    }
  });

  unsubscribeStores = () => {
    unsubProcess();
    unsubWindow();
  };
}

export function stopSessionSync(): void {
  if (syncTimer !== null) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (unsubscribeStores !== null) {
    unsubscribeStores();
    unsubscribeStores = null;
  }
  window.removeEventListener("beforeunload", handleBeforeUnload);
}
