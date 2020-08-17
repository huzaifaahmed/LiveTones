function initCam() {
    if ('mediaDevices' in navigator) {
        console.log('[Feed] App running')
        // Camera initializing
    } else {
        console.log('[Feed] Media device is not supported')
    }

    const video_player = document.getElementById('player')
    const photo_canvas = document.getElementById('photo_canvas')

    const captureButton = document.getElementById('capture')
    const sendButton = document.getElementById('send')
    const cameraButton = document.getElementById('camera')

    // var select = document.getElementById("select_cam")
    // var options = getDevices(false)
    // for (var i = 0; i < options.length; i++) {
    //   var opt = options[i]
    //   var el = document.createElement("option")
    //   el.textContent = opt
    //   el.value = opt
    //   select.appendChild(el)
    // }

    const constraints = {
        // video: {
        //   width: { min: 640, ideal: 1280, max: 1920 },
        //   height: { min: 360, ideal: 720, max: 1080 }
        // },
        video: {
            width: 640,
            height: 360
        },
        audio: false
    }

    captureButton.addEventListener('click', () => {
        takePhotoSnap()
        // Stop video streaming
        video_player.srcObject.getVideoTracks().forEach(track => {
            track.stop()
        })

        // Saving an image to LocalStorage
        var picture = photo_canvas.toDataURL('image/png');
        try {
            localStorage.setItem("cap_image", picture);
        } catch (error) {
            console.log("Storage failed: " + error);
        }
    })

    sendButton.addEventListener('click', () => {
        takePhotoSnap()
        document.querySelector('img').src = photo_canvas.toDataURL('image/png')
        
        var image = document.querySelector('img').src;
        var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
        var blob = base64ToBlob(base64ImageContent, 'image/png');
        var formData = new FormData();
        formData.append('picture', blob);

        var formArray= $("form").serializeArray();
        var data={};
        for (index in formArray){
            data[formArray[index].name]= formArray[index].value;
        }
        // const data = JSON.stringify($(this).serializeArray());
        sendAjaxQuery('/cam', data);
        event.preventDefault();
    })

    cameraButton.addEventListener('click', () => {
        // Attach the video stream to the video element and autoplay.
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                video_player.srcObject = stream
                // getDevices(true)
                togglePhotoVideoCapture(true)
            }, (err) => {
                console.log('[Camera] Permission denied OR camera start failure')
            })
    })
}

function takePhotoSnap() {
    const video_player = document.getElementById('player')
    const photo_canvas = document.getElementById('photo_canvas')
    const context = photo_canvas.getContext('2d')

    // Draw the video frame to the canvas.
    context.drawImage(video_player, 0, 0, photo_canvas.width, photo_canvas.height)
    togglePhotoVideoCapture(false)
}

function togglePhotoVideoCapture(show_video) {
    const video_player = document.getElementById('player')
    const photo_canvas = document.getElementById('photo_canvas')

    photo_canvas.style.display = show_video ? 'none' : 'block'
    video_player.style.display = show_video ? 'block' : 'none'
}

function getDevices(show_log) {
    navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
            let cameras = []
            devices.forEach((device) => {
                if (device.kind === 'videoinput') {
                    cameras.push(device)
                }
                if (show_log) {
                    console.log('device ID = ' + device.deviceId +
                        'kind = ' + device.kind +
                        'group ID = ' + device.groupId +
                        'label = ' + device.label)
                }
            })
            return cameras
        })
        .catch((err) => {
            console.log('[DEVICE] GetDevices error')
        })
}

function sendData() {
    var form = document.getElementById('myForm');
    sendAjaxQuery('/cam', JSON.stringify(serialiseForm()));
}

function serialiseForm() {
    var formArray = $("form").serializeArray();
    var data = {};
    for (index in formArray) {
        data[formArray[index].name] = formArray[index].value;
    }
    return data;
}

function sendAjaxQuery(url, data) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            var ret = dataR;
            // in order to have the object printed by alert
            // we need to JSON stringify the object
            document.getElementById('results').innerHTML= JSON.stringify(ret);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

function onSubmit() {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    // const data = JSON.stringify($(this).serializeArray());
    sendAjaxQuery('/cam', data);
    event.preventDefault();
}


function sendImage(userId, imageBlob) {
    var data = { userId: userId, imageBlob: imageBlob }
    $.ajax({
        data: JSON.stringify(data),
        dataType: 'application/json',
        url: '/cam',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            alert(result);
        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });
}

function base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
}