import { metricsIds } from '../constants/metricsIds';
const ERROR_MSG = {
  CPU_TEMP_SENSORS: (platform, reason) => {
    const messages = {
      NO_CORES_TEMP_SENSOR: <span>Individual Cores Temp. not available</span>,
      DEFAULT:
        platform === 'win32' ? (
          <span>
            No CPU sensors detected
            <br />
            Is LHM running?
          </span>
        ) : platform === 'linux' ? (
          <span>
            No CPU sensors detected <br />
            Are dependencies installed?
          </span>
        ) : (
          <span>No CPU sensors detected</span>
        ),
    };
    return messages[reason] || messages.DEFAULT;
  },
  CPU_LOAD: () => <span>Error trying to get the CPU load</span>,
  CPU_SPEED: () => <span>Error trying to get the CPU speed</span>,
  PROCESSES: (platform, reason) => {
    return <span>Couldn't access the system processes</span>;
  },
  UPTIME: () => <span>Couldn't access OS uptime</span>,
};

export default function getErrorMsg(id, platform, reason = 'DEFAULT') {
  const errors = {
    //CPU STATS
    [metricsIds.CPU_AVG_TEMP]: () =>
      ERROR_MSG.CPU_TEMP_SENSORS(platform, reason),
    [metricsIds.CPU_MAX_TEMP]: () =>
      ERROR_MSG.CPU_TEMP_SENSORS(platform, reason),
    [metricsIds.CPU_AVG_LOAD]: () => ERROR_MSG.CPU_LOAD(),
    [metricsIds.CPU_MAX_LOAD]: () => ERROR_MSG.CPU_LOAD(),
    [metricsIds.CPU_AVG_SPEED]: () => ERROR_MSG.CPU_SPEED(),
    [metricsIds.CPU_MAX_SPEED]: () => ERROR_MSG.CPU_SPEED(),
    [metricsIds.UPTIME]: () => ERROR_MSG.UPTIME(),
    [metricsIds.NUMBER_PROCESSES]: () => ERROR_MSG.PROCESSES(platform, reason),
    //CORE STATS
    [metricsIds.CORE_MAX_TEMP]: () =>
      ERROR_MSG.CPU_TEMP_SENSORS(platform, reason),
    [metricsIds.THERMAL_HEADROOM]: () =>
      ERROR_MSG.CPU_TEMP_SENSORS(platform, reason),
    [metricsIds.CORE_MAX_SPEED]: () => ERROR_MSG.CPU_SPEED(),
    [metricsIds.CORE_AVG_SPEED]: () => ERROR_MSG.CPU_SPEED(),
    [metricsIds.CORE_OVERLOAD]: () => ERROR_MSG.CPU_LOAD(),
    [metricsIds.MOST_ACTIVE_CORE]: () => ERROR_MSG.CPU_LOAD(),
    [metricsIds.PARKED_CORES]: () => ERROR_MSG.CPU_LOAD(),
    [metricsIds.THREAD_EFFICIENCY]: () => ERROR_MSG.CPU_LOAD(),
    [metricsIds.CORES_TEMP]: () => ERROR_MSG.CPU_TEMP_SENSORS(platform, reason),
    // PROCESSES
    [metricsIds.PROCESSES_DISPLAY]: () => ERROR_MSG.PROCESSES(platform, reason),
  };
  return errors[id]?.() || <span>Unknown Error :(</span>;
}
