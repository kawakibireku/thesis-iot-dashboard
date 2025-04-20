async function getDeviceData(id, type, dateRange) {
  if (!dateRange) {
    dateRange = [Date.now(), Date.now()]; // Fixed Date.now() syntax
  }
  console.log(dateRange);
  try {
    // Use import.meta.env instead of process.env
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${apiUrl}/api/device/${id}?type=${type}&startDate=${dateRange[0]}&endDate=${dateRange[1]}`
    );

    const data = await response.json(); // Added await

    return data;
  } catch (err) {
    throw new Error('failed to fetch');
  }
}

export { getDeviceData };
