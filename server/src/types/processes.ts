export interface ProcessInfo {
    pid: number,
    name: string,
    started: string,
    user: string,
    cpu: number,
    mem: number,
}
export interface ProcessesData {
    topProcesses: ProcessInfo[],
    total: number
}