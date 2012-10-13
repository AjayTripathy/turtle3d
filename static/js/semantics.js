/* Semantic actions for Turtle3D commands */

(function(window){

  window.makeState = function(){
    return {
      rotX: 1,
      rotY: 0,
      rotZ: 0,

      posX: 0,
      posY: 0,
      posZ: 0,

      penActive: true,
      penErase: false,
      penColor: 0x000000
    };
  }

  window.forward = function(dist, state) {
    var start = state.startPos;

    // Translate pos vector by rot vector
    var endX = state.posX + dist*state.rotX;
    var endY = state.posY + dist*state.rotY;
    var endZ = state.posZ + dist*state.rotZ;


    if(state.penActive){
      drawLine(state.posX, state.posY, state.posZ, endX, endY, endZ, state.penColor);
    }

    moveTurtleTo(endX, endY, endZ);

    state.posX = endX;
    state.posY = endY;
    state.posZ = endZ;
  }

  window.turnRight = function(angle, state){
    console.log(state);
    yaw(angle, state);
  }

  window.turnLeft = function(angle, state){
    yaw(-angle, state);
  }

  window.turnIn = function(angle, state){
    pitch(angle, state);
  }

  window.turnOut = function(angle, state){
    pitch(-angle, state);
  }
  
  window.penUp = function(state){
    state.penActive = false;
  }

  window.penDown = function(state){
    state.penActive = true;
  }

  window.penErase = function(state){
    state.penErase = true;
  }

  window.penColor = function(hex, state){
    state.penColor = hex;
  }


  /* Internal functions */
  function yaw(angle, state){
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    newZ = cos*state.rotZ - sin*state.rotX + 0;
    newX = sin*state.rotZ + cos*state.rotX + 0;
    newY = state.rotY; // fuck efficiency

    state.rotX = newX;
    state.rotY = newY;
    state.rotZ = newZ;
  }

  function pitch(angle, state){
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    newZ = cos*state.rotZ + 0 + sin*state.rotY;
    newX = state.rotX; // fuck efficiency
    newY = -sin*state.rotZ + 0 + cos*state.rotY;

    state.rotX = newX;
    state.rotY = newY;
    state.rotZ = newZ;
  }

  
})(window);
