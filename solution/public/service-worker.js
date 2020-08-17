/**
 * Service Worker
 */
importScripts('/js/idb.js')
importScripts('/js/utility.js')

const CACHE_DYNAMIC = 'wired-dynamic'
const CACHE_STATIC = 'wired-static'
const version = '1.2'

var STATIC_FILES = [
  '/',
  '/feed',
  '/account',
  '/favicon.ico',
  '/manifest.json',
  '/images/avatar.jpg',
  '/images/main-image.jpg',
  '/images/icons/camera-icon-192.png',
  '/images/icons/camera-icon-512.png',
  '/fontawesome/css/all.css',
  '/css/main.css',
  '/css/login.css',
  '/css/feed.css',
  '/jquery/jquery.min.js',
  '/material/material.indigo-pink.min.css',
  '/material/material.blue-pink.min.css',
  '/material/material.min.js',
  '/bcryptjs/bcrypt.min.js',
  '/js/account.js',
  '/js/app.js',
  '/js/camera.js',
  '/js/database.js',
  '/js/feed.js',
  '/js/helpers.js',
  '/js/idb.js',
  '/js/index.js',
  '/js/maps.js',
  '/js/post.js',
  '/js/search.js',
  '/js/user.js',
  '/js/utility.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/leaflet/leaflet-search.min.css',
  '/leaflet/leaflet.css',
  '/leaflet/leaflet-search.src.js',
  '/leaflet/leaflet.js',
  '/daterangepicker/daterangepicker.css',
  '/daterangepicker/moment.min.js',
  '/daterangepicker/daterangepicker.js',
]

var network_condition = navigator.onLine ? "online" : "offline"
var is_online = navigator.onLine

// SW Install
self.addEventListener('install', event => {
  console.log("[Service worker] Install App shell")
  event.waitUntil(
    caches.open(`${CACHE_STATIC}-${version}`)
      .then(cache => {
        console.log("[Service worker] Caches opened: " + `${CACHE_STATIC}-${version}`)
        cache.addAll(STATIC_FILES)
      })
      .catch(function (err) {
        console.log("service worker error: " + err.message)
      })
  )
})

// SW Activate
self.addEventListener('activate', event => {
  // Clean static cache
  event.waitUntil(
    caches.keys()
      .then(key_list => {
        return Promise.all(
          key_list.map(key => {
            if (key !== `${CACHE_DYNAMIC}-${version}` && key !== `${CACHE_STATIC}-${version}`) {
              console.log('[SW] Activate - Removing old cache', key)
              return caches.delete(key)
            }
          })
        )
      })
      .catch(err => {
        console.log('[SW] Activate - Cleanup error!', err)
      })
  )
  console.log('[Service worker] Activated!')
  return self.clients.claim()
})

// SW Fetch
self.addEventListener('fetch', function(e) {
    console.log('[Service Worker] Fetch', e.request.url)
    e.respondWith(
        fetch(e.request).catch(function() {
            return caches.match(e.request)
        })
    )
})
// self.addEventListener('fetch', event => {
//   // console.log('[Service worker] Local cache - FETCH')
//   var post_url = '/'

//   // console.log('Network status: ', network_condition)

//   // console.log('Req url: ', event.request.url)
//   // console.log('Req ?: ', event.request.url.indexOf(post_url) > -1)

//   // Cache first, then network for Given url (/feed)
//   if (event.request.url.indexOf(post_url) > -1) {
//     console.log('[SW] Cache first, then network: ', post_url)
//     event.respondWith(fetch(event.request)
//       .then(res => {
//         // Dynamically add items to IndexDB
//         var res_copy = res.clone()
//         // console.log('res: ', res_copy)
//         // console.log('js res: ', JSON.stringify(res_copy))
//         posts_json.json()
//         console.log(posts_json)
//           .then(data => {
//             for (var key in data) {
//               console.log('data: ', data)
//               dbPromise.then(async db => {
//                 var tx = db.transaction('posts', 'readwrite')
//                 var store = tx.objectStore('posts')
//                 await store.add(data[key])
//                 return tx.complete
//               })
//             }
//           })
//           .catch(err => {
//             console.log('[IDB] Putting items error: ', err)
//           })
//         return res
//       })
//       .catch(err => {
//         console.log('[SW] Respond error: ', err)
//       })
//     )
//   }

// })


// self.addEventListener('fetch', function (event) {
//     // console.log('[Service Worker] Fetch', event.request.url)
//     var dataUrl = '/data'
//     //if the request is '/data', post to the server
//     if (event.request.url.indexOf(dataUrl) > -1) {
//         /*
//          * When the request URL contains dataUrl, the app is asking for fresh
//          * weather data. In this case, the service worker always goes to the
//          * network and then caches the response. This is called the "Cache then
//          * network" strategy:
//          * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
//          */
//         return fetch(event.request).then(function (response) {
//             // note: it the network is down, response will contain the error
//             // that will be passed to Ajax
//             return response
//         }).catch(function (e) {
//             console.log("service worker error 1: " + e.message)
//         })
//     } else {
//         /*
//          * The app is asking for app shell files. In this scenario the app uses the
//          * "Cache, then if netowrk available, it will refresh the cache
//          * see stale-while-revalidate at
//          * https://jakearchibald.com/2014/offline-cookbook/#on-activate
//          */
//         event.respondWith(async function () {
//             const cache = await caches.open(CACHE_DYNAMIC)
//             const cachedResponse = await cache.match(event.request)
//             const networkResponsePromise = fetch(event.request)

//             event.waitUntil(async function () {
//                 const networkResponse = await networkResponsePromise
//                 await cache.put(event.request, networkResponse.clone())
//             }())

//             // Returned the cached response if we have one, otherwise return the network response.
//             return cachedResponse || networkResponsePromise
//         }())
//     }
// })
