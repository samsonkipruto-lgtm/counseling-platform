import axiosInstance from "./axiosConfig";

export interface AuditLogEntry {
  id: number;
  actor_role: string;
  actor_id: number | null;
  action: string;
  target_alias: string;
  timestamp: string;
  ip_address: string | null;
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  const response = await axiosInstance.get<AuditLogEntry[]>("/audit/logs/");
  return response.data;
}
