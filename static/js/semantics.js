/* Semantic actions for Turtle3D commands */

(function(window){

  window.makeEnv = function(){
    return {
      rotX: 1,
      rotY: 0,
      rotZ: 0,

      posX: 0,
      posY: 0,
      posZ: 0,

      penActive: true,
      penErase: false,
      penColor: "#000000"
    };
  }

  window.forward = function(dist, env) {
    var start = env.startPos;

    // Translate pos vector by rot vector
    var endX = env.posX + dist*env.rotX;
    var endY = env.posY + dist*env.rotY;
    var endZ = env.posZ + dist*env.rotZ;


    if(env.penActive){
      drawLine(env.posX, env.posY, end.posZ, endX, endY, endZ, env.penColor);
    }

    moveTurtle(env.posX, env.posY, env.posZ, endX, endY, endZ);

    env.x = endX;
    env.y = endY;
    env.z = endZ;
  }

  window.turnRight = function(angle, env){
    yaw(angle, env);
  }

  window.turnLeft = function(angle, env){
    yaw(-angle, env);
  }

  window.turnIn = function(angle, env){
    pitch(angle, env);
  }

  window.turnOut = function(angle, env){
    pitch(-angle, env);
  }
  
  window.penUp = function(env){
    env.penActive = false;
  }

  window.penDown = function(env){
    env.penActive = true;
  }

  window.penErase = function(env){
    env.penErase = true;
  }

  window.penColor = function(hex, env){
    env.penColor = hex;
  }


  /* Internal functions */
  function yaw(angle, env){
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    newX = cos*env.rotX - sin*env.rotY + 0;
    newY = sin*env.rotX + cos*env.rotY + 0;
    newZ = env.rotZ; // fuck efficiency

    env.rotX = newX;
    env.rotY = newY;
    env.rotZ = newZ;
  }

  function pitch(angle, env){
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    newX = cos*env.rotX + 0 + sin*env.rotZ;
    newY = env.rotY; // fuck efficiency
    newZ = -sin*env.rotX + 0 + cos*env.rotZ;

    env.rotX = newX;
    env.rotY = newY;
    env.rotZ = newZ;
  }

  
})(window);
