export default {
  makeId,
  saveToQuery,
  copyLink,
}

function makeId(length = 6) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var txt = ''
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function saveToQuery(obj) {
  const currQuery = new URLSearchParams(location.search)
  Object.keys(obj).forEach((key) => currQuery.set(key, obj[key]))
  const newUrl = `${location.protocol}//${location.host}${
    location.pathname
  }?${currQuery.toString()}`
  history.pushState({ path: newUrl }, '', newUrl)
}

function copyLink() {
  window.navigator.clipboard.writeText(window.location.href)
}
