export interface Os {
  platform: string | null;
  hostname: string | null;
  architecture: string | null;
  release: string | null;
  type: string | null;
}
export interface Cpu {
  manufacturer: string | null;
  brand: string | null;
  physicalCores: number | null;
  logicalThreads: number | null;
}
export interface MemorySlot {
  size: number | null;
  manufacturer: string | null;
  type: string | null;
  clockSpeed: number | null;
}
export interface Memory {
  memorySlots: MemorySlot[];
  total: number | null;
}
export interface Storage {
  name: string | null;
  type: string | null;
  size: number | null;
}
export interface StaticData {
  os: Os;
  cpu: Cpu;
  memory: Memory;
  storage: Storage[];
}
