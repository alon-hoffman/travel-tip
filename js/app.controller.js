import utils from './services/utils.js'
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearch = onSearch
window.onCopyLink = onCopyLink

function onInit() {
  locService.initCache()
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready')
    })
    .catch(() => console.log('Error: cannot init map'))

  const queryParams = new URLSearchParams(location.search)

  const lastSearch = queryParams.get('search')
  if (lastSearch) _doSearch(lastSearch)
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos')
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs)
    document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords)
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
    })
    .catch((err) => {
      console.log('err!!!', err)
    })
}
function onPanTo(lat, lng) {
  console.log('Panning the Map')
  mapService.panTo(lat, lng)
}

function onSearch(ev) {
  ev.preventDefault()
  const query = document.querySelector('.search input').value
  _doSearch(query)
}

function _doSearch(query) {
  utils.saveToQuery({ search: query })
  locService.search(query).then(({ loc: { lat, lng }, address }) => {
    onPanTo(lat, lng)
    document.querySelector('.current-location span').innerText = address
  })
}

function onCopyLink() {
  utils.copyLink()
}

//CRUD************
function onAddPlace(ev) {
  const name = prompt('name this place')
  if (name === '') return
  const loc = {
    lat: ev.latLng.lat(),
    lng: ev.latLng.lng(),
  }

  createLoc(loc, name)
  //    renderCards()
  renderMarkers()
}

function renderMarkers() {
  const locs = locService.getLocs()
  console.log(locs)
}

function onUpdateLoc() {
  //To be changed to modal
  const newName = prompt('choose a new name')
  updateLocName(id, newName)
  renderMarkers
}

function onRemoveLoc(id) {
  locService.removeLoc(id)
  renderMarkers()
}
