export function formattedFloat(entry: number): number{
    return parseFloat(entry.toFixed(2))
}
export function byteToGb(entry:number): number{
    return entry / (1024 ** 3)
}