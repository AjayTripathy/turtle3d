/* Semantic actions for Turtle3D commands */

(function(window){

  function makeEnv(){
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

  function forward(dist, env) {
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

  function turnRight(angle, env){
    yaw(angle, env);
  }

  function turnLeft(angle, env){
    yaw(-angle, env);
  }

  function turnIn(angle, env){
    pitch(angle, env);
  }

  function turnOut(angle, env){
    pitch(-angle, env);
  }
  
  function penUp(env){
    env.penActive = false;
  }

  function penDown(){
    env.penActive = true;
  }

  function penErase(){
    env.penErase = true;
  }

  function penColor(hex){
    env.penColor = hex;
  }


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
