export interface CoreTemp {
  value: number;
  coreNumber: number;
}
export interface WmiCpuTempResponse {
  coresTemp: CoreTemp[] | null;
  packageTemp: number | null;
}
export interface CpuTempServiceResponse {
  cpuTemp: number | null;
  coresTemp: CoreTemp[] | null;
  thermalHeadroom: number | null;
}
