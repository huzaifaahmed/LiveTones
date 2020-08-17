function logout() {
    $.ajax({
        url: '/users/logout',
        type: 'GET',
        success: function (res) {
            if (res.success) {
                window.location.href = '/'
            } else {
                window.location.href = '/users/login'
            }
        },
        error: function (err) {
            window.location.href = '/users/login'
        }
    })
}

function account() {
    window.location.href = "/account"
}


function add_data(data, object_store) {
    var dbPromise = idb.openDb('wired-store', 1, db => {})
    dbPromise.then(async db => {  // async is necessary as we use await below
        var tx = db.transaction(object_store, 'readwrite')
        var store = tx.objectStore(object_store)
        await store.add(data) //await necessary as add return a promise
        return tx.complete
    }).then(function () {
        console.log('added item to the store! ' + JSON.stringify(data))
    }).catch(function (error) {
        console.log(error)
    })
}

function post(data) {
    var post = "<div class=\"mdl-card shopping mdl-cell mdl-shadow--2dp mdl-cell--6-col\">" +
        "<div class=\"mdl-card__media mdl-color--white mdl-color-text--grey-600\">" +
        "<img src=\"/images/" + data["image"] + "\">" +
        "</div>" +
        "<div class=\"mdl-card__supporting-text mdl-color-text--grey-600\">" +
        data["comment"] + "</div>" +
        "<div class=\"mdl-card__supporting-text meta mdl-color-text--grey-600\">" +
        "<div class=\"minilogo\"></div>" + "<div class=\"meta\">" +
        "<strong>" + data["author"] + "</strong>" +
        "<span>festival:" + data["festival"] + "</span>" +
        "<span>" + data["date"] + "</span>" +
        "</div>" + "</div>" + "</div>"
    return post
}

/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    hideOfflineWarning();
    loadData();
}, false);


function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='block';
}

function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}
