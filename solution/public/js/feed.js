
// // Update posts
// function update() {
//   // Toggle refresh state
//   $('#update .icon').toggleClass('d-none')

//   // Call Giphy API
//   $.get(giphy.url, giphy.query)
//     // Success
//     .done(function (res) {
//       // Empty Element
//       $('#feed').empty()
//       // Loop posts
//       $.each(res.data, function (i, giphy) {
//         // Add posts HTML
//         $('#feed').prepend(
//           '<div class="col-sm-6 col-md-4 col-lg-3 p-1">' +
//           '<img class="w-100 img-fluid" src="' + giphy.images.downsized_large.url + '">' +
//           '</div>'
//         )
//       })
//     })

//     // Failure
//     .fail(function () {
//       $('.alert').slideDown()
//       setTimeout(function () { $('.alert').slideUp() }, 2000)
//     })

//     // Complete
//     .always(function () {
//       // Re-Toggle refresh state
//       $('#update .icon').toggleClass('d-none')
//     })

//   // Prevent submission if originates from click
//   return false
// }

// // Manual refresh
// // $('#update a').click(update)

// function initFeed() {
//     $.ajax({
//         url: '/feed',
//         type: 'POST',
//         success: function (res) {
//             if (res.success) {
//                 // var views = document.getElementById('results')
//                 var posts = res.posts
//                 for (i = 0; i < posts.length; i++) {
//                     // console.log("The number is " + JSON.stringify(posts[i]) + "<br>")
//                     // views.innerHTML = views.innerHTML + "<div>" + JSON.stringify(posts[i]) + "</div>"
//                     $('#posts').prepend(
//                         post(posts[i])
//                     )
//                     console.log(getid(posts[i]))
//                 }
//                 // document.getElementById('results').innerHTML = posts
//             }
//         },
//         error: function (xhr, status, error) {
//             alert('Error: ' + error.posts)
//         }
//     })
// }

function getid(data) {
    var id = data["_id"]
    return id
}

function initFeed( object_store) {
    var dbPromise = idb.openDb('wired-store', 1, db => {})
    dbPromise.then(function (db) {
        var tx = db.transaction(object_store, 'readonly')
        var store = tx.objectStore(object_store)
        return store.getAll()
    }).then(function (posts) {
        console.log(posts)
        for (i = 0; i < posts.length; i++) {
            // console.log("The number is " + JSON.stringify(posts[i]) + "<br>")
            // views.innerHTML = views.innerHTML + "<div>" + JSON.stringify(posts[i]) + "</div>"
            console.log("post: " + i + " found")
            $('#posts').prepend(
                post(posts[i])
            )
            console.log(getid(posts[i]))
        }
    })
}

$(document).ready(function () {
    initFeed('posts')
})

{/* $(document).ready(function () {
        initFeed(<%- JSON.stringify(posts_arr) %>)
 }) */}

// function initFeed(posts) {
//     console.log(posts)
//     for (i = 0; i < posts.length; i++) {
//         // console.log("The number is " + JSON.stringify(posts[i]) + "<br>")
//         // views.innerHTML = views.innerHTML + "<div>" + JSON.stringify(posts[i]) + "</div>"
//         $('#posts').prepend(
//             post(posts[i])
//         )
//         console.log(getid(posts[i]))
//     }
//     // document.getElementById('results').innerHTML = posts
// }
