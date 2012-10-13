window.onload = function() {
    ///////////////////////
    // socket connections
    /////////////////////
    socket = io.connect();
    var usercount = document.getElementById('usercount-value');

    socket.on('usercount', function(count) {
        usercount.innerText = count;
    });

    socket.on('drawLine', function(args) {
        drawLine.apply(this, args);
    });


    /////////////
    // graphics
    ///////////
    var CAMERA_DISTANCE = 200,
        CAMERA_ROTATION_H = 0,
        CAMERA_ROTATION_V = 0;

    var width = window.innerWidth,
        height = window.innerHeight,
        fov = 90,
        aspect = width/height,
        near = 0.1,
        far = 1000;

    var renderer = new THREE.WebGLRenderer();
    var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = CAMERA_DISTANCE;
    var scene = new THREE.Scene();
    scene.add(camera);
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    var turtleGeometry = new THREE.CubeGeometry(50, 50, 50);
    var turtleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
    var turtle = new THREE.Mesh(turtleGeometry, turtleMaterial);
    var turtleX = turtle.position.x;
    var turtleY = turtle.position.y;
    var turtleZ = turtle.position.z;
    scene.add(turtle);


    var drawLine = function(x0, y0, z0, x1, y1, z1, color) {
        if (!color) {
            color = 0x000000;
        }
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(x0, y0, z0));
        geometry.vertices.push(new THREE.Vector3(x1, y1, z1));
        var material = new THREE.LineBasicMaterial({ color: color });
        var line = new THREE.Line(geometry, material);
        scene.add(line);
        return line;
    };

    var rotateCameraTo = function(hdegrees, vdegrees) {
        var hradians = Math.PI * hdegrees/180;
        var vradians = Math.PI * vdegrees/180;
        var x, y, z;
        y = CAMERA_DISTANCE * Math.sin(vradians);
        z = CAMERA_DISTANCE * Math.cos(vradians);
        x = z * Math.sin(hradians);
        z = z * Math.cos(hradians);
        camera.position.x = x;
        camera.position.y = y;
        camera.position.z = z;
        camera.lookAt(new THREE.Vector3(0,0,0));
    };

    var updateCameraDistance = function() {
        
    };

    var moveTurtleTo = function(x, y, z) {
        turtle.position = new THREE.Vector3(x, y, z);
    };

    var moveTurtleTo = function(x, y, z) {
        turtleX = x;
        turtleY = y;
        turtleZ = z;
    };

    var animate = function() {
        requestAnimationFrame(animate);
        if (turtle.position.)
        renderer.render(scene, camera);
    };


    /////////////
    // controls
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

    document.addEventListener('scrollwheel', function(evt) {
        CAMERA_DISTANCE += evt.wheelDeltaY;
        updateCameraDistance();
    });

    // testing stuff
    drawLine(0, 0, 0, 100, 0, 0, 0xff0000);
    drawLine(0, 0, 0, 0, 100, 0, 0x00ff00);
    drawLine(0, 0, 0, 0, 0, 100, 0x0000ff);

    //console.log(camera.position.x, camera.position.y, camera.position.z);

};