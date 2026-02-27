export interface CpuData {
  load: number;
  speed: number;
  coresLoad: number[];
  coresSpeed: number[];
  coreOverload: number;
  mostActiveCore: {
    coreNumber: number;
    value: number;
  };
  parkedCores: number;
  activeThreadsCount: number;
  threadEfficiency: number;
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
