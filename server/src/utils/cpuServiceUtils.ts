
export function getParkedCores(coresLoad: number[]):number{
    return coresLoad.filter(load => load === 0).length
}
export function getActiveThreadsCount(coresLoad: number[]):number{
    return coresLoad.filter(load => load > 5).length
}