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
    CAMERA_ROTATION_V = Math.min(CAMERA_ROTATION_V, 90);
    CAMERA_ROTATION_V = Math.max(CAMERA_ROTATION_V, -90);
    rotateCameraTo(CAMERA_ROTATION_H, CAMERA_ROTATION_V);
});
/*
document.addEventListener('mousewheel', function(evt) {
    CAMERA_DISTANCE += evt.wheelDeltaY;
    CAMERA_DISTANCE = Math.min(CAMERA_DISTANCE, CAMERA_FAR);
    CAMERA_DISTANCE = Math.max(CAMERA_DISTANCE, CAMERA_MIN_ZOOM);
    updateCameraDistance();
});
*/

document.addEventListener('mousewheel', function(evt) {
    CAMERA_FOV -= evt.wheelDeltaY;
    CAMERA_FOV = Math.min(CAMERA_FOV, CAMERA_FOV_MAX);
    CAMERA_FOV = Math.max(CAMERA_FOV, CAMERA_FOV_MIN);
    zoomCameraTo(CAMERA_FOV);
});

