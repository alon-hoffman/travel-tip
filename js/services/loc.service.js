import utils from './utils.js'
import { storage } from './storage.service.js'

const MAP_KEY = "AIzaSyCF_JZFHLmoM5v07TyoljTDUArcYMn4yl4"

export const locService = {
    getLocs,
    createLoc,
    initCache,
    updateLocName,
    removeLoc
}

var locCache = []

function initCache() {
    if (storage.load('locations')) locCache = storage.load('locations')
}

function getLocs() {
    return locCache
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

// function getLocs() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(locs)
//         }, 2000)
//     })
// }

//CRUD*********************************8

function createLoc(pos, name) {
    const newLoc = {
        id: utils.makeId(),
        name,
        pos,
        created: Date.now(),
        lastUpdate: Date.now(),
    }
    locCache.unshift(newLoc)
    storage.save('locations', locCache)
}

function updateLocName(id, newName) {
    const loc = getLoc(id)
    loc.name = newName
    locCache.lastUpdate = Date.now()
    storage.save('locations', locCache)
}

function removeLoc(id) {
    const locIdx = locCache.findIndex(loc => id === loc.id)
    locCache.splice(locIdx, 1)
    storage.save('locations', locCache)
}


// Inner utils***************************

function getLoc(id) {
    return locCache.find(location => id == location.id)
}





window.XXX = getLoc


