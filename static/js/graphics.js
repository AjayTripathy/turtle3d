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
    window.CAMERA_DISTANCE = 200;
    window.CAMERA_ROTATION_H = 0;
    window.CAMERA_ROTATION_V = 0;
    window.CAMERA_MIN_ZOOM = 100;

    var width = window.innerWidth,
        height = window.innerHeight,
        fov = 90,
        aspect = width/height;
    window.CAMERA_NEAR = 0.1,
    window.CAMERA_FAR = 1000;

    // camera + renderer
    var renderer = new THREE.WebGLRenderer();
    var camera = new THREE.PerspectiveCamera(fov, aspect, CAMERA_NEAR, CAMERA_FAR);
    camera.position.z = CAMERA_DISTANCE;
    var scene = new THREE.Scene();
    scene.add(camera);
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    // light
    var topDirectionalLight = new THREE.DirectionalLight(0xffffff);
    topDirectionalLight.position.set(0, 1, 0);
    scene.add(topDirectionalLight);
    var frontDirectionalLight = new THREE.DirectionalLight(0xffffff);
    frontDirectionalLight.position.set(0, 0, 1);
    scene.add(frontDirectionalLight);

    //turtle
    var loader = new THREE.JSONLoader();
    var turtle;
    loader.load('static/models/turtle/turtle.js', function(geometry) {
        var material = new THREE.MeshLambertMaterial({color: 0x00C986});
        turtle = new THREE.Mesh(geometry, material);
        turtle.scale.x = 500;
        turtle.scale.y = 500;
        turtle.scale.z = 500;
        window.TURTLE_X = turtle.position.x;
        window.TURTLE_Y = turtle.position.y;
        window.TURTLE_Z = turtle.position.z;
        scene.add(turtle);
    });


    window.drawLine = function(x0, y0, z0, x1, y1, z1, color) {
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

    window.rotateCameraTo = function(hdegrees, vdegrees) {
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

    window.updateCameraDistance = function() {
        var currentDist = Math.sqrt(Math.pow(camera.position.x, 2) + Math.pow(camera.position.y, 2) + Math.pow(camera.position.z, 2));
        var unitX = camera.position.x/currentDist;
        var unitY = camera.position.y/currentDist;
        var unitZ = camera.position.z/currentDist;
        camera.position.x = unitX * CAMERA_DISTANCE;
        camera.position.y = unitY * CAMERA_DISTANCE;
        camera.position.z = unitZ * CAMERA_DISTANCE;
    };

    window.moveTurtleTo = function(x, y, z) {
        turtle.position = new THREE.Vector3(x, y, z);
    };

    window.rotateTurtleTo = function(xdegrees, ydegrees, zdegrees) {
        var xradians = Math.PI * xdegrees/180;
        var yradians = Math.PI * ydegrees/180;
        var zradians = Math.PI * zdegrees/180;
        turtle.rotation.x = xradians;
        turtle.rotation.y = yradians;
        turtle.rotation.z = zradians;
    };
/*
    window.moveTurtleTo = function(x, y, z) {
        turtleX = x;
        turtleY = y;
        turtleZ = z;
    };
*/
    var animate = function() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();


    // testing stuff
    drawLine(0, 0, 0, 100, 0, 0, 0xff0000);
    drawLine(0, 0, 0, 0, 100, 0, 0x00ff00);
    drawLine(0, 0, 0, 0, 0, 100, 0x0000ff);

    //console.log(camera.position.x, camera.position.y, camera.position.z);

};
