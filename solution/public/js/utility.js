/**
 * Service Worker - functions
 */
// Static cache startegy - Cache with Network Fallback
const staticCache = (req, cachaName) => {
  return caches.match(req).then(cachedRes => {

    // Return cached response if found
    if (cachedRes) return cachedRes

    // Fall back to network
    return fetch(req).then(networkRes => {
      // Update cache with new response
      caches.open(cachaName)
        .then(cache => cache.put(req, networkRes))
        // Error
        .catch((err) => {
          console.log("[Service worker] StaticCache error : " + err.message)
        })
      // Return Clone of Network Response
      return networkRes.clone()
    })
  })
}

// Network with Cache Fallback
const fallbackCache = (req) => {

  // Try Network
  return fetch(req).then(networkRes => {

    // Check res is OK, else go to cache
    if (!networkRes.ok) throw 'Fetch Error'

    // Update cache
    caches.open(`${CACHE_STATIC}-${version}`)
      .then(cache => cache.put(req, networkRes))

    // Return Clone of Network Response
    return networkRes.clone()
  })

    // Try cache
    .catch(err => caches.match(req))
}

/**
 * IDB functions
 */
// var dbPromise = idb.openDb('posts-store', 1, function (db) {
//   if (!db.objectStoreNames.contains('posts')) {
//     db.createObjectStore('posts', { keyPath: 'id' })
//   }
// })

// function writeData(st, data) {
//   return dbPromise
//     .then((db) => {
//       var tx = db.transaction(st, 'readwrite')
//       var store = tx.objectStore(st)
//       store.put(data)
//       return tx.complete
//     })
// }

// function readAllData(st) {
//   return dbPromise
//     .then((db) => {
//       var tx = db.transaction(st, 'readonly')
//       var store = tx.objectStore(st)
//       return store.getAll()
//     })
// }

// function IsInArray(string, array) {
//   for (var i = 0 i < array.length i++) {
//     if (array[i] === string) {
//       return true
//     }
//   }
//   return false
// }
