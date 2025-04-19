async function getDeviceData(id=1, type, dateRange) {
    i
    try {
        const response = await fetch(`${process.env.API_URL}/api/device/${id}?type=${type}&startDate`)
    }
}