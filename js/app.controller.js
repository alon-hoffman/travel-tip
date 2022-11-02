import utils from './services/utils.js'
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const controller = {
    onAddPlace,
}

window.onUpdateLoc = onUpdateLoc
window.onload = onInit
window.renderMarkers = renderMarkers
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearch = onSearch
window.onCopyLink = onCopyLink

var gMarkers = []

function onInit() {
    locService.initCache()
    renderCards()

    mapService
        .initMap()
        .then(
            renderMarkers
        )
        .catch(() => console.log('Error: cannot init map'))

    const queryParams = new URLSearchParams(location.search)

    const lastSearch = queryParams.get('search')
    if (lastSearch) _doSearch(lastSearch)
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

// function onAddMarker() {
//     console.log('Adding a marker')
//     mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
// }

function onGetLocs() {
    locService.getLocs().then((locs) => {
        document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
    })
}

// function onGetUserPos() {
//     getPosition()
//         .then(pos => {
//             console.log('User position is:', pos.coords)
//             document.querySelector('.user-pos').innerText =
//                 `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
//         })
//         .catch(err => {
//             console.log('err!!!', err)
//         })
// }
function onPanTo(lat, lng) {
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
    if (name === '' || name === null) return
    const loc = {
        lat: ev.latLng.lat(),
        lng: ev.latLng.lng(),
    }

    locService.createLoc(loc, name)
    renderCards()
    renderMarkers()
}

// loc.pos.lat, loc.pos.lng

function renderCards() {
    const locs = locService.getLocs()
    const htmlStr = locs.map(
        (loc) =>
            ` <article  class="location-card">
    <h3 contenteditable="true" onblur="onUpdateLoc('${loc.id}',this.innerText, event)" 
    onkeydown="onUpdateLoc('${loc.id}',this.innerText, event)">${loc.name}</h3>
    <p>Tel Aviv, IL</p>
    <span class="icons"
      ><svg
        class="marker-remove"
        onclick="onRemoveLoc('${loc.id}')"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24">
        <path
          d="M16.37,16.1L11.75,11.47L11.64,11.36L3.27,3L2,4.27L5.18,7.45C5.06,7.95 5,8.46 5,9C5,14.25 12,22 12,22C12,22 13.67,20.15 15.37,17.65L18.73,21L20,19.72M12,6.5A2.5,2.5 0 0,1 14.5,9C14.5,9.73 14.17,10.39 13.67,10.85L17.3,14.5C18.28,12.62 19,10.68 19,9A7,7 0 0,0 12,2C10,2 8.24,2.82 6.96,4.14L10.15,7.33C10.61,6.82 11.26,6.5 12,6.5Z" />
      </svg>
      <svg
        class="marker-goto"
        onclick="onPanTo(${loc.pos.lat}, ${loc.pos.lng})"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24">
        <path
          d="M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19C12,19 6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M20,19C20,21.21 16.42,23 12,23C7.58,23 4,21.21 4,19C4,17.71 5.22,16.56 7.11,15.83L7.75,16.74C6.67,17.19 6,17.81 6,18.5C6,19.88 8.69,21 12,21C15.31,21 18,19.88 18,18.5C18,17.81 17.33,17.19 16.25,16.74L16.89,15.83C18.78,16.56 20,17.71 20,19Z" />
      </svg>
    </span>
  </article>`
    )

    document.querySelector('.location-cards-container').innerHTML =
        htmlStr.join('')
}

function renderMarkers() {
    const map = mapService.getMap()
    gMarkers.forEach((marker) => marker.setMap(null))
    const locs = locService.getLocs()
    gMarkers = locs.map(({ pos, name }) => {
        const coord = pos
        return new google.maps.Marker({
            position: coord,
            map: map,
            title: name,
        })
    })
}

function onUpdateLoc(id, name, ev) {
    if (ev.type === "blur"
        || ev.keyCode === 13) {
        locService.updateLocName(id, name)
        renderCards()
        renderMarkers()
    }
}

function onRemoveLoc(id) {
    locService.removeLoc(id)
    renderCards()
    renderMarkers()
}
