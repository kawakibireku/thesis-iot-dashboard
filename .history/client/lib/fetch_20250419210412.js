async function getDeviceData(id=1, type, dateRange) {
    if(!dateRange) {
        dateRange = [new Date.now, ]
    }
    try {
        const response = await fetch(`${process.env.API_URL}/api/device/${id}?type=${type}&startDate`)
    }
}