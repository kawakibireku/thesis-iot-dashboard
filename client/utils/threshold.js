const getThreshold = (threshold) => {
    if (threshold <= 50) {
        return {
            color: 'green',
            status: 'safe',
            text: 'Baik'
        }
    } else if (threshold >= 51 && threshold <= 100) {
        return {
            color: 'blue',
            status: 'normal',
            text: 'sedang'
        }
    } else if (threshold >= 101 && threshold <= 200) {
        return {
            color: 'orange',
            status: 'warning',
            text: 'tidak sehat'
        }
    } else if (threshold >= 201 && threshold <= 300) {
        return {
            color: 'red',
            status: 'caution',
            text: 'sangat tidak sehat'
        }
        
    } else {
        return {
            color: 'black',
            status: 'danger',
            text: 'berbahaya'
        }
    }
}

export {
    getThreshold
}