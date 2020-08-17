/**
 *
 */
// let deferredPromt

function initApp() {
    // loadData()
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function (registration) {
                console.log('Service worker registered! ' + registration.scope)
            })
            .catch(function (err) {
                console.log('Service worker is not registered! ' + err)
            })
    }

    //check for support
    if ('indexedDB' in window) {
        // initDatabase()
        console.log('This browser supports IndexedDB')
    }
    else {
        console.log('This browser doesn\'t support IndexedDB')
    }
}

// function openDb(name, version, upgradeCallback)
function initIndexDB() {
    var dbPromise = idb.openDb('wired-store', 1, db => {
        if (!db.objectStoreNames.contains('posts')) {
            var postsDB = db.createObjectStore('posts', { keyPath: '_id' })
            postsDB.createIndex('author', 'author', { unique: false })
            postsDB.createIndex('email', 'email', { unique: false })
            postsDB.createIndex('festival', 'festival', { unique: false })
            postsDB.createIndex('date', 'date', { unique: false })
            postsDB.createIndex('image', 'image', { unique: false })
            postsDB.createIndex('comment', 'comment', { unique: false })
        }
        if (!db.objectStoreNames.contains('festivals')) {
            var postsDB = db.createObjectStore('festivals', { keyPath: '_id' })
            postsDB.createIndex('name', 'name', { unique: false })
            postsDB.createIndex('genre', 'genre', { unique: false })
            postsDB.createIndex('description', 'description', { unique: false })
            postsDB.createIndex('date', 'date', { unique: false })
            postsDB.createIndex('address', 'address', { unique: false })
            postsDB.createIndex('location', 'location', { unique: false })
            postsDB.createIndex('image', 'image', { unique: false })
        }
    })
    for (i = 0; i < posts_json.length; i++) {
        // console.log('data: ', posts_json[i])
        add_data(posts_json[i], 'posts')
    }
    for (i = 0; i < festivals_json.length; i++) {
        // console.log('data: ', festivals_json[i])
        add_data(festivals_json[i], 'festivals')
    }
}
