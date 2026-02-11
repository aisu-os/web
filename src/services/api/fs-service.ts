import type { FileNode, FileType } from "@/types";
import { apiGet, apiPatch, apiPost } from "./client";

// ── Backend DTO types ──

interface FileNodeDTO {
  id: string;
  name: string;
  path: string;
  node_type: string;
  mime_type: string | null;
  size: number;
  is_trashed: boolean;
  original_path: string | null;
  trashed_at: string | null;
  desktop_x: number | null;
  desktop_y: number | null;
  created_at: string;
  updated_at: string;
  children?: FileNodeDTO[];
}

interface MoveResultDTO {
  old_path: string;
  new_path: string;
  node: FileNodeDTO;
}

interface CopyResultDTO {
  source_path: string;
  new_path: string;
  node: FileNodeDTO;
}

interface BulkResultDTO {
  succeeded: string[];
  failed: { path: string; error: string | null }[];
}

// ── DTO -> FileNode mapping ──

function mapNode(dto: FileNodeDTO): FileNode {
  return {
    name: dto.name,
    path: dto.path,
    type: dto.node_type as FileType,
    size: dto.size || undefined,
    mimeType: dto.mime_type ?? undefined,
    children: dto.children?.map(mapNode),
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
    isTrashed: dto.is_trashed || undefined,
    originalPath: dto.original_path ?? undefined,
    trashedAt: dto.trashed_at ? new Date(dto.trashed_at) : undefined,
    desktopX: dto.desktop_x ?? undefined,
    desktopY: dto.desktop_y ?? undefined,
  };
}

// ── API functions ──

export async function fetchFileTree(): Promise<FileNode> {
  const dto = await apiGet<FileNodeDTO>("/fs/tree");
  return mapNode(dto);
}

export async function fetchNode(path: string): Promise<FileNode> {
  const dto = await apiGet<FileNodeDTO>(
    `/fs/node?path=${encodeURIComponent(path)}`,
  );
  return mapNode(dto);
}

export async function fetchDirectoryListing(
  path: string,
  sortBy = "name",
  sortDir = "asc",
): Promise<{ node: FileNode; children: FileNode[]; total: number }> {
  const dto = await apiGet<{
    path: string;
    node: FileNodeDTO;
    children: FileNodeDTO[];
    total: number;
  }>(
    `/fs/ls?path=${encodeURIComponent(path)}&sort_by=${sortBy}&sort_dir=${sortDir}`,
  );
  return {
    node: mapNode(dto.node),
    children: dto.children.map(mapNode),
    total: dto.total,
  };
}

export async function createNode(
  parentPath: string,
  name: string,
  nodeType: FileType,
  mimeType?: string,
  size?: number,
): Promise<FileNode> {
  const dto = await apiPost<FileNodeDTO>("/fs/node", {
    parent_path: parentPath,
    name,
    node_type: nodeType,
    mime_type: mimeType,
    size: size ?? 0,
  });
  return mapNode(dto);
}

export async function renameNode(
  path: string,
  newName: string,
): Promise<{ oldPath: string; newPath: string; node: FileNode }> {
  const dto = await apiPatch<MoveResultDTO>("/fs/rename", {
    path,
    new_name: newName,
  });
  return {
    oldPath: dto.old_path,
    newPath: dto.new_path,
    node: mapNode(dto.node),
  };
}

export async function moveNode(
  sourcePath: string,
  destParentPath: string,
): Promise<{ oldPath: string; newPath: string; node: FileNode }> {
  const dto = await apiPost<MoveResultDTO>("/fs/move", {
    source_path: sourcePath,
    dest_parent_path: destParentPath,
  });
  return {
    oldPath: dto.old_path,
    newPath: dto.new_path,
    node: mapNode(dto.node),
  };
}

export async function copyNode(
  sourcePath: string,
  destParentPath: string,
): Promise<{ sourcePath: string; newPath: string; node: FileNode }> {
  const dto = await apiPost<CopyResultDTO>("/fs/copy", {
    source_path: sourcePath,
    dest_parent_path: destParentPath,
  });
  return {
    sourcePath: dto.source_path,
    newPath: dto.new_path,
    node: mapNode(dto.node),
  };
}

export async function deleteNode(
  path: string,
  permanent = false,
): Promise<FileNode> {
  const dto = await apiPost<FileNodeDTO>("/fs/delete", {
    path,
    permanent,
  });
  return mapNode(dto);
}

export async function bulkDelete(
  paths: string[],
  permanent = false,
): Promise<BulkResultDTO> {
  return apiPost<BulkResultDTO>("/fs/bulk-delete", { paths, permanent });
}

export async function bulkMove(
  sourcePaths: string[],
  destParentPath: string,
): Promise<BulkResultDTO> {
  return apiPost<BulkResultDTO>("/fs/bulk-move", {
    source_paths: sourcePaths,
    dest_parent_path: destParentPath,
  });
}

export async function fetchTrash(): Promise<FileNode[]> {
  const dtos = await apiGet<FileNodeDTO[]>("/fs/trash");
  return dtos.map(mapNode);
}

export async function restoreNode(
  path: string,
): Promise<{ oldPath: string; newPath: string; node: FileNode }> {
  const dto = await apiPost<MoveResultDTO>("/fs/restore", { path });
  return {
    oldPath: dto.old_path,
    newPath: dto.new_path,
    node: mapNode(dto.node),
  };
}

export async function emptyTrash(): Promise<{ deleted: number }> {
  return apiPost<{ deleted: number }>("/fs/empty-trash", {});
}

export async function searchFiles(
  query: string,
  scopePath?: string,
): Promise<FileNode[]> {
  let url = `/fs/search?q=${encodeURIComponent(query)}`;
  if (scopePath) {
    url += `&path=${encodeURIComponent(scopePath)}`;
  }
  const dtos = await apiGet<FileNodeDTO[]>(url);
  return dtos.map(mapNode);
}

export async function updateDesktopPositions(
  positions: { path: string; x: number; y: number }[],
): Promise<void> {
  await apiPatch<unknown>("/fs/desktop-positions", { positions });
}
