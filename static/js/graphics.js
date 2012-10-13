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
        centerX = 0,
        centerY = 0,
        centerZ = 0;

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
    turtle = null;
    var TURTLE_X, TURTLE_Y, TURTLE_Z, TURTLE_R_X, TURTLE_R_Y, TURTLE_R_Z;
    var TURTLE_MOVE_SPEED = 10,
        TURTLE_ROTATE_SPEED = 0.1;
    window.onTurtleAnimationEnd = function() {
      if (window.qdActions.length > 0){ 
              var qdState = window.qdActions.splice(0,1)[0];
                      var qdFn = qdState.fn;
                          var args = qdState.args;
                              qdFn.apply(this, args);
                                }   

    };
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

    var LAST_LINE;

    window.drawLine = function(x0, y0, z0, x1, y1, z1, color) {
        if (!color) {
            color = defaultColor;
        }
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(x0+centerX, y0+centerY, z0+centerZ));
        geometry.vertices.push(new THREE.Vector3(x1+centerX, y1+centerY, z1+centerZ));
        var material = new THREE.LineBasicMaterial({ color: color });
        var line = new THREE.Line(geometry, material);
        line.geometry.dynamic = true;
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
        var haxis = new THREE.Vector3(1, 0, 0);
        var vaxis = new THREE.Vector3(0, 1, 0);
        var rotationMatrix1 = new THREE.Matrix4();
        rotationMatrix1.makeRotationAxis(haxis, -vradians);
        var rotationMatrix2 = new THREE.Matrix4();
        rotationMatrix2.makeRotationAxis(vaxis, hradians);
        rotationMatrix2.multiplySelf(rotationMatrix1);
        camera.rotation = new THREE.Vector3().setEulerFromRotationMatrix(rotationMatrix2);
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

    window.rotateTurtleTo = function(xdegrees, ydegrees, zdegrees) {
        var xradians = Math.PI * xdegrees/180;
        var yradians = Math.PI * ydegrees/180;
        var zradians = Math.PI * zdegrees/180;
        TURTLE_R_X = xradians % (2*Math.PI);
        TURTLE_R_Y = yradians % (2*Math.PI);
        TURTLE_R_Z = zradians % (2*Math.PI);
        if (TURTLE_R_X != turtle.rotation.x || TURTLE_R_Y != turtle.rotation.y || TURTLE_R_Z != turtle.rotation.z) {
            window.TURTLE_IS_MOVING = true;
        }
    };
*/

    var getHeading = function() {
        var heading = new THREE.Vector3(0, 0, 1);
        var rotationMatrix = new THREE.Matrix4();
        rotationMatrix.extractRotation(turtle.matrix);
        rotationMatrix.multiplyVector3(heading);
        return heading;
    };

    window.turnRight = function(angle) {
        var rotationMatrix1 = new THREE.Matrix4();
        rotationMatrix1.extractRotation(turtle.matrix);
        var rotationMatrix2 = new THREE.Matrix4();
        rotationMatrix2.setRotationFromEuler(new THREE.Vector3(0, -angle, 0), "XYZ");
        //rotationMatrix2.makeRotationY(angle);
        rotationMatrix1.multiplySelf(rotationMatrix2);
        var euler = new THREE.Vector3().setEulerFromRotationMatrix(rotationMatrix1);
        TURTLE_R_X = euler.x;
        TURTLE_R_Y = euler.y;
        TURTLE_R_Z = euler.z;
        window.TURTLE_IS_MOVING = true;
    };

    window.turnLeft = function(angle) {
        turnRight(-angle);
    };

    window.turnIn = function(angle) {
        var rotationMatrix1 = new THREE.Matrix4();
        rotationMatrix1.extractRotation(turtle.matrix);
        var rotationMatrix2 = new THREE.Matrix4();
        rotationMatrix2.setRotationFromEuler(new THREE.Vector3(angle, 0, 0), "XYZ");
        //rotationMatrix2.makeRotationX(angle);
        rotationMatrix1.multiplySelf(rotationMatrix2);
        var euler = new THREE.Vector3().setEulerFromRotationMatrix(rotationMatrix1);
        TURTLE_R_X = euler.x;
        TURTLE_R_Y = euler.y;
        TURTLE_R_Z = euler.z;
        window.TURTLE_IS_MOVING = true;
    };

    window.turnOut = function(angle) {
        turnIn(-angle);
    };

    window.forward = function(dist) {
        var heading = getHeading();
        heading.normalize();
        heading.multiplyScalar(dist);
        TURTLE_X = turtle.position.x + heading.x;
        TURTLE_Y = turtle.position.y + heading.y;
        TURTLE_Z = turtle.position.z + heading.z;
        if (heading.x != 0 || heading.y != 0 || heading.z != 0) {
            window.TURTLE_IS_MOVING = true;
            var lineX = turtle.position.x - centerX;
            var lineY = turtle.position.y - centerY;
            var lineZ = turtle.position.z - centerZ;
            LAST_LINE = drawLine(lineX, lineY, lineZ, lineX, lineY, lineZ);
        }
    };

    var setZeroTimeout=function(a){if(a.postMessage){var b=[],c="asc0tmot",d=function(a){b.push(a),postMessage(c,"*")},e=function(d){if(d.source==a&&d.data==c){d.stopPropagation&&d.stopPropagation();if(b.length)try{b.shift()()}catch(e){setTimeout(function(a){return function(){throw a.stack||a}}(e),0)}b.length&&postMessage(c,"*")}};if(a.addEventListener)return addEventListener("message",e,!0),d;if(a.attachEvent)return attachEvent("onmessage",e),d}return setTimeout}(window);

    var animate = function() {
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
            if (turtleMoved && LAST_LINE != null) {
                var start = LAST_LINE.geometry.vertices[0];
                scene.remove(LAST_LINE);
                LAST_LINE = drawLine(start.x, start.y, start.z, turtle.position.x, turtle.position.y, turtle.position.z);
            }
            if (turtleMoved && TURTLE_X == turtle.position.x && TURTLE_Y == turtle.position.y && TURTLE_Z == turtle.position.z 
                && TURTLE_R_X == turtle.rotation.x && TURTLE_R_Y == turtle.rotation.y && TURTLE_R_Z == turtle.rotation.z) {
                setZeroTimeout(function() {
                    TURTLE_IS_MOVING = false;
                    LAST_LINE = null;
                    onTurtleAnimationEnd();
                }, 0);
 
            }
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();


    // testing stuff
    drawLine(0, 0, 0, 50, 0, 0, 0xff0000);
    drawLine(0, 0, 0, 0, 50, 0, 0x00ff00);
    drawLine(0, 0, 0, 0, 0, 50, 0x0000ff);

    //console.log(camera.position.x, camera.position.y, camera.position.z);

};
