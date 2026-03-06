import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
} from 'react';
const MetricsContext = createContext(null);
import { socket } from '../services/sockets';
import { getMaxValues } from '../utils/metricsHelper';
import { getArrayAvg, findMaxWithIndex } from '../utils/math';

export const MetricsProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [processesData, setProcessesData] = useState({});
  const [cpuTempData, setCpuTempData] = useState(null);
  const [maxValues, setMaxValues] = useState({
    cpuLoad: null,
    cpuTemp: null,
    coreSpeed: { index: null, value: null },
  });

  const cpuAvgLoad = useMemo(() => {
    const cpuUsage = history.map((entry) => entry.cpuLoad);
    return getArrayAvg(cpuUsage);
  }, [history]);

  const coreMaxTemp = useMemo(() => {
    if (!cpuTempData?.coresTemp || cpuTempData.coresTemp.length === 0)
      return { coreNumber: null, value: null };
    return findMaxWithIndex(cpuTempData.coresTemp);
  }, [cpuTempData]);

  const currentData = useMemo(
    () => (history.length > 0 ? history.at(-1) : null),
    [history]
  );

  useEffect(() => {
    socket.on('dynamicData', (data) => {
      const hasError =
        !data || Object.keys(data).length === 0 || typeof data !== 'object';
      if (!hasError) {
        setHistory((prevHistory) => {
          let updatedHistory = [...prevHistory, data];
          if (updatedHistory.length > 20) {
            updatedHistory = updatedHistory.slice(1);
          }
          return updatedHistory;
        });
        setMaxValues((prev) => {
          return getMaxValues(prev, {
            cpuLoad: data.cpu.load,
            coresSpeed: data.cpu?.coresSpeed || [],
          });
        });
      } else {
        console.warn('Dynamic Data recieved is not valid:', data);
      }
    });
    socket.on('cpuTempData', (cpuTempData) => {
      setMaxValues((prev) => {
        return getMaxValues(prev, { cpuTemp: cpuTempData.cpuTemp });
      });
      setCpuTempData(cpuTempData);
    });
    socket.on('processesData', (processesData) => {
      setProcessesData(processesData);
    });
    return () => {
      socket.off('dynamicData');
      socket.off('processesData');
      socket.off('cpuTempData');
    };
  }, []);

  const sensorsHealth = useMemo(() => {
    return {
      cpu: {
        temp: {
          hasTemp: !!cpuTempData?.cpuTemp,
          hasCoresTemp: !!cpuTempData?.coresTemp,
          reason: !cpuTempData?.cpuTemp
            ? 'NO_TEMP_SENSOR_DETECTED'
            : cpuTempData?.coresTemp?.length === 0 || !cpuTempData?.coresTemp
              ? 'NO_CORES_TEMP_SENSOR'
              : null,
        },
      },
    };
  });

  const contextData = useMemo(
    () => ({
      currentData,
      computedStats: { cpuAvgLoad, coreMaxTemp },
      history,
      processesData,
      cpuTempData,
      maxValues,
      sensorsHealth,
    }),
    [
      currentData,
      cpuAvgLoad,
      coreMaxTemp,
      history,
      processesData,
      cpuTempData,
      maxValues,
      sensorsHealth,
    ]
  );

  return (
    <MetricsContext.Provider value={contextData}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used inside a MetricsProvider');
  }
  return context;
};
