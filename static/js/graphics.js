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
    window.sendDrawLine = function(x0, y0, z0, x1, y1, z1) {
        socket.emit('drawLine', [x0+centerX, y0+centerY, z0+centerZ, x1+centerX, y1+centerY, z1+centerZ]);
    };


    /////////////
    // graphics
    ///////////
    window.CAMERA_DISTANCE = 200;
    window.CAMERA_ROTATION_H = 0;
    window.CAMERA_ROTATION_V = 0;
    window.CAMERA_FOV = 75;
    window.CAMERA_FOV_MIN = 5;
    window.CAMERA_FOV_MAX = 120;

    var width = window.innerWidth,
        height = window.innerHeight,
        aspect = width/height,
        near = 0.1,
        far = 1000,
        centerX = 1000,
        centerY = 1000,
        centerZ = 1000;

    var defaultColor = Math.round(Math.random() * 16777215); 

    // camera + renderer
    var renderer = new THREE.WebGLRenderer();
    var camera = new THREE.PerspectiveCamera(CAMERA_FOV, aspect, near, far);
    camera.position.x = centerX;
    camera.position.y = centerY;
    camera.position.z = centerZ + CAMERA_DISTANCE;
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
    var TURTLE_X, TURTLE_Y, TURTLE_Z, TURTLE_R_X, TURTLE_R_Y, TURTLE_R_Z;
    var TURTLE_MOVE_SPEED = 5,
        TURTLE_ROTATE_SPEED = 0.05;
    window.onTurtleAnimationEnd = function() {console.log('turtle movement complete')};
    window.TURTLE_IS_MOVING = false;
    loader.load('static/models/turtle/turtle.js', function(geometry) {
        var material = new THREE.MeshLambertMaterial({color: defaultColor});
        turtle = new THREE.Mesh(geometry, material);
        turtle.scale.x = 250;
        turtle.scale.y = 250;
        turtle.scale.z = 250;
        TURTLE_X = centerX;
        TURTLE_Y = centerY;
        TURTLE_Z = centerZ;
        TURTLE_R_X = 0;
        TURTLE_R_Y = 0;
        TURTLE_R_Z = 0;
        turtle.position.x = TURTLE_X;
        turtle.position.y = TURTLE_Y;
        turtle.position.z = TURTLE_Z;
        turtle.rotation.x = TURTLE_R_X;
        turtle.rotation.y = TURTLE_R_Y;
        turtle.rotation.z = TURTLE_R_Z;
        scene.add(turtle);
    });


    window.drawLine = function(x0, y0, z0, x1, y1, z1, color) {
        if (!color) {
            color = defaultColor;
        }
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(x0+centerX, y0+centerY, z0+centerZ));
        geometry.vertices.push(new THREE.Vector3(x1+centerX, y1+centerY, z1+centerZ));
        var material = new THREE.LineBasicMaterial({ color: color });
        var line = new THREE.Line(geometry, material);
        scene.add(line);
        return line;
    };

    window.rotateCameraTo = function(hdegrees, vdegrees) {
        var hradians = Math.PI * hdegrees/180;
        var vradians = Math.PI * vdegrees/180;
        var x, y, z;
        y = CAMERA_DISTANCE * Math.sin(vradians) + centerY;
        z = CAMERA_DISTANCE * Math.cos(vradians) + centerZ;
        x = (z-centerZ) * Math.sin(hradians) + centerX;
        z = (z-centerZ) * Math.cos(hradians) + centerZ;
        camera.position.x = x;
        camera.position.y = y;
        camera.position.z = z;
        camera.lookAt(new THREE.Vector3(centerX,centerY,centerZ));
    };

    window.zoomCameraTo = function(fovdegrees) {
        camera.fov = fovdegrees;
        camera.updateProjectionMatrix();
    };
/*
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
*/

    window.rotateTurtleTo = function(xdegrees, ydegrees, zdegrees) {
        var xradians = Math.PI * xdegrees/180;
        var yradians = Math.PI * ydegrees/180;
        var zradians = Math.PI * zdegrees/180;
        TURTLE_R_X = xradians % (2*Math.PI);
        TURTLE_R_Y = yradians % (2*Math.PI);
        TURTLE_R_Z = zradians % (2*Math.PI);
    };

    window.moveTurtleTo = function(x, y, z) {
        TURTLE_X = x + centerX;
        TURTLE_Y = y + centerY;
        TURTLE_Z = z + centerZ;
    };

    var animate = function() {
        requestAnimationFrame(animate);
        var turtleMoved = false;
        if (turtle) {
            if (turtle.position.x > TURTLE_X) {
                turtle.position.x = Math.max(turtle.position.x - TURTLE_MOVE_SPEED, TURTLE_X);
                turtleMoved = true;
            }
            if (turtle.position.x < TURTLE_X) {
                turtle.position.x = Math.min(turtle.position.x + TURTLE_MOVE_SPEED, TURTLE_X);
                turtleMoved = true;
            }
            if (turtle.position.y > TURTLE_Y) {
                turtle.position.y = Math.max(turtle.position.y - TURTLE_MOVE_SPEED, TURTLE_Y);
                turtleMoved = true;
            }
            if (turtle.position.y < TURTLE_Y) {
                turtle.position.y = Math.min(turtle.position.y + TURTLE_MOVE_SPEED, TURTLE_Y);
                turtleMoved = true;
            }
            if (turtle.position.z > TURTLE_Z) {
                turtle.position.z = Math.max(turtle.position.z - TURTLE_MOVE_SPEED, TURTLE_Z);
                turtleMoved = true;
            }
            if (turtle.position.z < TURTLE_Z) {
                turtle.position.z = Math.min(turtle.position.z + TURTLE_MOVE_SPEED, TURTLE_Z);
                turtleMoved = true;
            }
            if (turtle.rotation.x > TURTLE_R_X) {
                turtle.rotation.x = Math.max(turtle.rotation.x - TURTLE_ROTATE_SPEED, TURTLE_R_X);
                turtleMoved = true;
            }
            if (turtle.rotation.x < TURTLE_R_X) {
                turtle.rotation.x = Math.min(turtle.rotation.x + TURTLE_ROTATE_SPEED, TURTLE_R_X);
                turtleMoved = true;
            }
            if (turtle.rotation.y > TURTLE_R_Y) {
                turtle.rotation.y = Math.max(turtle.rotation.y - TURTLE_ROTATE_SPEED, TURTLE_R_Y);
                turtleMoved = true;
            }
            if (turtle.rotation.y < TURTLE_R_Y) {
                turtle.rotation.y = Math.min(turtle.rotation.y + TURTLE_ROTATE_SPEED, TURTLE_R_Y);
                turtleMoved = true;
            }
            if (turtle.rotation.z > TURTLE_R_Z) {
                turtle.rotation.z = Math.max(turtle.rotation.z - TURTLE_ROTATE_SPEED, TURTLE_R_Z);
                turtleMoved = true;
            }
            if (turtle.rotation.z < TURTLE_R_Z) {
                turtle.rotation.z = Math.min(turtle.rotation.z + TURTLE_ROTATE_SPEED, TURTLE_R_Z);
                turtleMoved = true;
            }
            if (turtleMoved) {
                TURTLE_IS_MOVING = turtleMoved;
            }
            if (turtleMoved && TURTLE_X == turtle.position.x && TURTLE_Y == turtle.position.y && TURTLE_Z == turtle.position.z 
                && TURTLE_R_X == turtle.rotation.x && TURTLE_R_Y == turtle.rotation.y && TURTLE_R_Z == turtle.rotation.z ) {
                onTurtleAnimationEnd();
            }
        }
        renderer.render(scene, camera);
    };

    animate();


    // testing stuff
    drawLine(0, 0, 0, 50, 0, 0, 0xff0000);
    drawLine(0, 0, 0, 0, 50, 0, 0x00ff00);
    drawLine(0, 0, 0, 0, 0, 50, 0x0000ff);

    //console.log(camera.position.x, camera.position.y, camera.position.z);

};
