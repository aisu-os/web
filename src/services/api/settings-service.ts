import { apiGet, apiPut, apiDelete } from "./client";

// ── Backend DTO types ──

interface AppSettingDTO {
  app_id: string;
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
}

interface AppSettingsListDTO {
  app_id: string;
  settings: AppSettingDTO[];
  total: number;
}

// ── Frontend types ──

export interface AppSetting {
  appId: string;
  key: string;
  value: unknown;
  createdAt: Date;
  updatedAt: Date;
}

// ── DTO -> Frontend mapping ──

function mapSetting(dto: AppSettingDTO): AppSetting {
  return {
    appId: dto.app_id,
    key: dto.key,
    value: dto.value,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  };
}

// ── API functions ──

export async function fetchAppSettings(
  appId: string,
): Promise<{ settings: AppSetting[]; total: number }> {
  const dto = await apiGet<AppSettingsListDTO>(
    `/settings/${encodeURIComponent(appId)}`,
  );
  return {
    settings: dto.settings.map(mapSetting),
    total: dto.total,
  };
}

export async function fetchAppSetting(
  appId: string,
  key: string,
): Promise<AppSetting> {
  const dto = await apiGet<AppSettingDTO>(
    `/settings/${encodeURIComponent(appId)}/${encodeURIComponent(key)}`,
  );
  return mapSetting(dto);
}

export async function setAppSetting(
  appId: string,
  key: string,
  value: unknown,
): Promise<AppSetting> {
  const dto = await apiPut<AppSettingDTO>(
    `/settings/${encodeURIComponent(appId)}/${encodeURIComponent(key)}`,
    { value },
  );
  return mapSetting(dto);
}

export async function deleteAppSetting(
  appId: string,
  key: string,
): Promise<void> {
  await apiDelete(
    `/settings/${encodeURIComponent(appId)}/${encodeURIComponent(key)}`,
  );
}
