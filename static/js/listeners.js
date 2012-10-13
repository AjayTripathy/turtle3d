/////////////
// graphics controls
///////////
document.addEventListener('keydown', function(evt) {
    switch (evt.keyCode) {
        case 37: // left arrow
            CAMERA_ROTATION_H += 5;
            break;
        case 38: // up arrow
            CAMERA_ROTATION_V -= 5;
            break;
        case 39: // right arrow
            CAMERA_ROTATION_H -= 5;
            break;
        case 40: // down arrow
            CAMERA_ROTATION_V += 5;
            break;
    }
    rotateCameraTo(CAMERA_ROTATION_H, CAMERA_ROTATION_V);
});

document.addEventListener('mousewheel', function(evt) {
    CAMERA_FOV += evt.wheelDeltaY/10;
    CAMERA_FOV = Math.min(CAMERA_FOV, CAMERA_FOV_MAX);
    CAMERA_FOV = Math.max(CAMERA_FOV, CAMERA_FOV_MIN);
    zoomCameraTo(CAMERA_FOV);
});

