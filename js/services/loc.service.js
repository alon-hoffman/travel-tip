import utils from './utils.js'
import { storage } from './storage.service.js'

export const locService = {
    getLocs,
    createLoc,
    initCache
}

var locCache = []

function initCache() {
    if (storage.load('locations')) locCache = storage.load('locations')
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

//CRUD*********************************8

function createLoc(loc, name) {
    const newLoc = {
        id: utils.makeId,
        name,
        loc,
    }
    locCache.unshift(newLoc)
    storage.save('locations', locCache)
}

function updateLocName(id, newName) {
    const loc = getLoc(id)
    loc.name = newName
}



// Inner utils***************************

function getLoc(id) {
    return locCache.find(location => id == location.id)
}
window.createLoc = createLoc




