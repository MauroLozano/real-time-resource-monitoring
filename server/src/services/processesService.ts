import si from 'systeminformation';
import type { ProcessesData, ProcessInfo } from '../types/processes.js';

export const getProcessesData = async (): Promise<ProcessesData> => {
  const rawProcessesData = await si.processes();
  let topProcesses: ProcessInfo[] = rawProcessesData.list
    .filter(
      (p) => p.name !== 'System Idle Process' && p.name !== 'Idle' && p.cpu > 0
    )
    .sort((a, b) => {
      return b.cpu - a.cpu;
    })
    .slice(0, 10)
    .map((p) => ({
      pid: p.pid,
      mem: p.mem,
      cpu: p.cpu,
      name: p.name,
      user: p.user,
      started: p.started,
    }));
  const processesData = {
    topProcesses: topProcesses,
    total: rawProcessesData.list.length,
  };
  return processesData;
};
