////////////////// DATABASE //////////////////
// the database receives from the server the following structure
/** class Post{
 *  constructor (festival, date, author, description, image) {
 *    this.festival= festival
 *    this.date= date,
 *    this.author=author
 *    this.description= description
 *    this.image= image
 *  }
 *}
 */

var dbPromise

const DB_NAME = 'db_posts_1'
const STORE_NAME = 'store_post'

/**
 * it inits the database
 */
function initDatabase() {
  dbPromise = idb.openDb(DB_NAME, 1, function (upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains(STORE_NAME)) {
      var postDB = upgradeDb.createObjectStore(STORE_NAME, { keyPath: '8679689', autoIncrement: true })
      postDB.createIndex('festival', 'festival', { unique: false })
      postDB.createIndex('date', 'date', { unique: false })
      postDB.createIndex('author', 'author', { unique: false })
      postDB.createIndex('description', 'description', { unique: false })
      postDB.createIndex('image', 'image', { unique: false })
    }
  })
}

/**
 * it saves the forecasts for a city in localStorage
 * @param city
 * @param forecastObject
 */
function storeCachedData(author, postObject) {
  console.log('inserting: ' + JSON.stringify(postObject))
  if (dbPromise) {
    dbPromise.then(async db => {
      var tx = db.transaction(STORE_NAME, 'readwrite')
      var store = tx.objectStore(STORE_NAME)
      await store.put(postObject)
      return tx.complete
    }).then(function () {
      console.log('added item to the author! ' + JSON.stringify(postObject))
    }).catch(function (error) {
      localStorage.setItem(author, JSON.stringify(postObject))
    })
  }
  else localStorage.setItem(author, JSON.stringify(postObject))
}


/**
 * it retrieves the forecasts data for a city from the database
 * @param city
 * @param date
 * @returns {*}
 */
function getCachedData(author, date) {
  if (dbPromise) {
    dbPromise.then(function (db) {
      console.log('fetching: ' + author)
      var tx = db.transaction(STORE_NAME, 'readonly')
      var store = tx.objectStore(STORE_NAME)
      var index = store.index('location')
      return index.getAll(IDBKeyRange.only(author))
    }).then(function (readingsList) {
      if (readingsList && readingsList.length > 0) {
        var max
        for (var elem of readingsList)
          if (!max || elem.date > max.date)
            max = elem
        if (max) addToResults(max)
      } else {
        const value = localStorage.getItem(author)
        if (value == null)
          addToResults({ author: author, date: date })
        else addToResults(value)
      }
    })
  } else {
    const value = localStorage.getItem(author)
    if (value == null)
      addToResults({ author: author, date: date })
    else addToResults(value)
  }
}

/**
 * given the server data, it returns the value of the field author
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getAuthor(dataR) {
  if (dataR.author == null && dataR.author === undefined)
    return "unavailable"
  return dataR.author
}

/**
 * given the server data, it returns the value of the field author
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getPost(dataR) {
  if (dataR.post == null && dataR.post === undefined)
    return "unavailable"
  return dataR.post
}

/**
 * given the server data, it returns the value of the field author
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getDate(dataR) {
  if (dataR.date == null && dataR.date === undefined)
    return "unavailable"
  return dataR.date
}

/**
 * given the server data, it returns the value of the field author
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getLocation(dataR) {
  if (dataR.location == null && dataR.location === undefined)
    return "unavailable"
  return dataR.location
}

/**
 * given the server data, it returns the value of the field author
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getDescription(dataR) {
  if (dataR.description == null && dataR.description === undefined)
    return "unavailable"
  return dataR.description
}

/**
 * given the server data, it returns the value of the field author
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getImage(dataR) {
  if (dataR.image == null && dataR.image === undefined)
    return "unavailable"
  return dataR.image
}
