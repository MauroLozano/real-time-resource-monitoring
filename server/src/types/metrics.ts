export interface CpuData {
  load: number | null;
  speed: number | null;
  coresLoad: number[] | null;
  coresSpeed: number[] | null;
  coreOverload: number | null;
  mostActiveCore: {
    coreNumber: number;
    value: number;
  } | null;
  parkedCores: number | null;
  activeThreadsCount: number | null;
  threadEfficiency: number | null;
}
export interface OsData {
  uptime: number;
}
export interface MemoryData {
  used: number;
  free: number;
}
export interface DynamicData {
  cpu: CpuData;
  memory: MemoryData;
  os: OsData;
  timestamp: string;
}
