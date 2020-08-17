
// Camera Class
class Camera {
  constructor(video_node, w, h) {
    // Camera stream DOM node
    this.video_node = video_node
    this.width = w //800
    this.height = h //600
    console.log('[Camera class] Cam created')
  }

  // Camera feed (viewfinder) on
  switch_on() {
    // Get camera media stream and set on player <video>
    navigator.mediaDevices.getUserMedia({
      video: { width: this.width, height: this.height },
      audio: false
    }).then(stream => {
      this.video_node.srcObject = this.stream = stream
    })
  }

  // Camera feed (viewfinder) off
  switch_off() {
    // Pause video node
    this.video_node.pause()
    // Stop media stream
    this.stream.getTracks()[0].stop()
  }

  // Capture photo from camera stream
  take_photo() {

    // Create a <canvas> element to render the photo
    let canvas = document.createElement('canvas')
    // Set canvas dimensions same as video stream
    canvas.setAttribute('width', this.width)
    canvas.setAttribute('height', this.height)

    // Get canvas context
    let context = canvas.getContext('2d')

    // Draw (render) the image onto the canvas
    context.drawImage(this.video_node, 0, 0, canvas.width, canvas.height)

    // Get the canvas image as a data uri
    this.photo = context.canvas.toDataURL()

    // Destroy canvas
    context = null
    canvas = null

    return this.photo
  }
}


// Init new camera instance on the player node
// Init new camera instance on the player node
const camera = new Camera($('#player')[0]);

function initCam() {
  // Switch on camera in viewfinder
  $('#viewfinder').on("show.bs.modal", () => {
    camera.switch_on();
  });

  // Switch off camera in viewfinder
  $('#viewfinder').on("hidden.bs.modal", () => {
    camera.switch_off();
  });

  // Take photo
  $('#shutter').on("click", () => {

    let photo = camera.take_photo();

    // Show photo preview in camera button
    $('#camera').css('background-image', `url(${photo})`).addClass('withphoto');
  });

  // Submit message
  $('#send').on("click", () => {

    // Get caption text
    let caption = $('#caption').val();

    // Check message is ok
    if (!camera.photo || !caption) {

      // Show notification and return
      toastr.warning('Photo & Caption Required.', 'Incomplete Message');
      return;
    }

    console.log('adding message');
    console.log(caption);

    // Reset caption & photo on success
    $('#caption').val('');
    $('#camera').css('background-image', '').removeClass('withphoto');
    camera.photo = null;

  });
}