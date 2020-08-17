function getDate() {
    $.ajax({
        url: '/account',
        type: 'POST',
        success: function (res) {
            if (res.success)
                // message = "Created on:" + res.date
                message = res.date
                document.getElementById('date').innerHTML = message
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message)
        }
    })
    // getPosts()
    // event.preventDefault()
}

function getPosts() {
    var author = document.getElementById('name').innerHTML
    var email = document.getElementById('email').innerHTML
    // console.log(email)
    data = {author: author, email: email}
    $.ajax({
        url: '/account',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (res) {
            if (res.success)
                var posts = res.posts
                for (i = 0; i < posts.length; i++) {
                    $('#posts').prepend(
                        post(posts[i])
                    )
                }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message)
        }
    })
    // event.preventDefault()
}

$(document).ready(function () {
    getDate()
    getPosts()
})
