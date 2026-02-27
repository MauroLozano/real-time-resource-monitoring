export const getArrayAvg = (data, decimals = 2) => {
  if (!Array.isArray(data) || data.length === 0) return 0;
  let sum = 0;
  data.forEach((element) => {
    sum += element;
  });
  return parseFloat((sum / data.length).toFixed(decimals));
};

export const findMaxWithIndex = (data) => {
  if (!Array.isArray(data) || data.length === 0)
    return { value: null, index: null };
  const result = data.reduce(
    (acc, currentValue, index) => {
      if (acc.value === null || acc.value < currentValue) {
        return { value: currentValue, index: index };
      }
      return acc;
    },
    { value: null, index: null }
  );
  return result;
};
