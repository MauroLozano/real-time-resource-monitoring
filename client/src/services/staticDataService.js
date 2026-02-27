const serverUrl = 'http://localhost:3000';

export const fetchStaticData = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/staticData`);
    if (!response.ok) {
      throw new Error(
        `Error in the API: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`Error recovering the Static Data: ${error}`);
    throw error;
  }
};
