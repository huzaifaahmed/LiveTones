// Init new camera instance on the player node
let camera

function initFeed() {
  if ('mediaDevices' in navigator) {
    console.log('[Feed] App running')
  } else {
    console.log('[Feed] Media device is not supported')
  }

  // Camera initializing
  camera = new Camera($('#player')[0], 600, 600)

  // Camera swithc ON
  $('#viewfinder').on('show.bs.modal', () => {
    console.log('[Camera ON]')
    camera.switch_on()
  })

  // Camera swithc OFF
  $('#viewfinder').on('hidden.bs.modal', () => {
    console.log('[Camera OFF]')
    camera.switch_off()
  })

  // Take a photo
  $('#shutter').on('click', () => {
    console.log('[Shutter] Take a photo')
    let photo = camera.take_photo()
    // Show photo
        // Show photo preview in camera button
    $('#camera').css('background-image', `url(${photo})`).addClass('withphoto')
  })

  // Send a message
  $('#send').on('click', () => {
    let caption = $('#caption').val()

    if (!caption || !camera.photo) {
      console.log('[Message] Error: Message required')
      return
    }
    console.log('[Message] Submitting a message: ', caption)

    // Render new message in feed
    renderPost({photo: camera.photo, caption})

    console.log('[Message] Submitting a message: ', caption)
    // Resetting caption
    $('#caption').val('')
    $('#camera').css('background-image', '').removeClass('withphoto')
    camera.photo = null
  })
}

// Create new message element
const renderPost = (message) => {
  // Message HTML
  let msgHTML = `
    <div style="display:none" class="row message bg-light mb-2 rounded shadow">
      <div class="col-2 p-1">
        <img src="${message.photo}" class="photo w-100 rounded">
      </div>
      <div class="col-10 p-1">${message.caption}</div>
    </div>`

  // Prepend to #messages
  $(msgHTML).prependTo('#posts').show(500)
    // Bind a click handler on new img element to show in modal
    .find('img').on("click", showPhoto)
}

// Show message photo in modal
const showPhoto = (e) => {

  // Get photo src
  let photoSrc = $(e.currentTarget).attr('src')

  // Set to and show photoframe modal
  $('#photoframe img').attr('src', photoSrc)
  $('#photoframe').modal('show')
}
