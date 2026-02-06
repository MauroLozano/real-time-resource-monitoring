import { metricsIds } from "../constants/metricsIds"

const getCpuSensorMsg = (platform)=>(
    platform === 'win32' ?
        <span>No CPU sensors detected<br />Is LHM running?</span>
    : platform === 'linux' ?
        <span>'No CPU sensors detected'</span>
    : 
        <span>'No CPU sensors detected'</span>
)
const noCpuLoadMsg = <span>Error trying to get the CPU load</span>
const noCpuSpeedMsg = <span>Couldn't access the CPU frequency.</span>

export default function getErrorMsg(id, platform){
    const noCpuSensorsMsg = getCpuSensorMsg(platform)
    const errors = {
        [metricsIds.CPU_AVG_TEMP]: noCpuSensorsMsg,
        [metricsIds.CPU_MAX_TEMP]: noCpuSensorsMsg, 
        [metricsIds.CPU_AVG_LOAD]: noCpuLoadMsg,
        [metricsIds.CPU_MAX_LOAD]: noCpuLoadMsg,
        [metricsIds.CPU_AVG_SPEED]: noCpuSpeedMsg,
        [metricsIds.CPU_MAX_SPEED]: noCpuSpeedMsg,
        [metricsIds.CORE_MAX_TEMP]: noCpuSensorsMsg,
        [metricsIds.THERMAL_HEADROOM]: noCpuSensorsMsg,
        [metricsIds.CORE_MAX_SPEED]: noCpuSpeedMsg,
        [metricsIds.CORE_AVG_SPEED]: noCpuSpeedMsg,
        [metricsIds.CORE_OVERLOAD]: noCpuLoadMsg,
        [metricsIds.MOST_ACTIVE_CORE]: noCpuLoadMsg,
        [metricsIds.PARKED_CORES]: noCpuLoadMsg,
        [metricsIds.THREAD_EFFICIENCY]: noCpuLoadMsg,
        [metricsIds.CORES_TEMP]: noCpuSensorsMsg
    }
    return errors[id] || <span>Unknown Error :(</span>
}