var Closure = function(body, args, env, recurse){
  this.body = body
  this.args = args
  this.env = env
  this.recurse = recurse
}

window.state = null;
window.interpreterEnv = { "__up__": null}; 
window.qdActions = [];
window.onTurtleAnimationEnd = function() {
  console.log('turtle movement complete')
  if (window.qdActions.length > 0){ 
    var qdState = window.qdActions.splice(0,1)[0];
    console.log(qdState)
    var qdFn = qdState.fn;
    var args = qdState.args;
    qdFn.apply(this, args);
  }   
};  

var Exec = function(stmts){  
  var evalExp = function(e, env){
    var lookup = function(name, env){
      if (!(env[name] === undefined)){
         return env[name]
      }
      else if (!(env['__up__'] === undefined))  {
         return lookup(name, env['__up__'])
      }
      else{
         console.log("couldn't find")
         console.log(name)
         console.log("Interpreter Error")
      }
    }
    if (e[0] === 'null'){
      return null
    }
    if (e[0] === 'len'){
      var dict = evalExp(e[1], env)
      var cnt = 0
      for (var i in dict){
       cnt = cnt + 1
      }
      return cnt
    }
    if (e[0] === 'type'){
       if (evalExp(e[1], env) instanceof Array){
         return 'list'
       }
       if (evalExp(e[1], env) instanceof Object){
         return 'table'
       }
    }
    if (e[0] === 'keys'){
      dict = evalExp(e[1], env)
      var n = 0
      var keys = {}
      for (var i in dict){
        keys[n] = i
        n = n + 1
      }
      return keys
    }
    if (e[0] === 'exp'){
      return evalExp(e[1], env)
    }
    if (e[0] === 'move'){
      socket.emit('move', {'ship': id+evalExp(e[1], env), 'dir': evalExp(e[2], env)})
      return true
    }
    if (e[0] === 'shoot'){
      socket.emit('shoot', {'ship': id+evalExp(e[1], env), 'dir': evalExp(e[2], env)})
      return true
    }
    if (e[0] === 'rand'){
      return Math.round(Math.random()*evalExp(e[1], env))
    }
    if (e[0] === 'abs'){
      return Math.abs(evalExp(e[1], env))
    }
    if (e[0] === 'int-lit'){
      return e[1]
    }
    if (e[0] === 'string-lit'){
      return e[1]
    }
    if (e[0] === 'dict-lit'){
      return {}
    }
    if (e[0] === 'var'){
      return lookup(e[1], env)
    }
    if (e[0] === 'put'){
      var dict = evalExp(e[1], env)
      var index = evalExp(e[2], env)
      var value = evalExp(e[3], env)
      dict[index] = value 
    }
    if (e[0] === 'get'){
      var dict = evalExp(e[1], env)
      var index = evalExp(e[2], env)
      return dict[index]
    }
    if (e[0] === '+'){
       return evalExp(e[1], env) + evalExp(e[2], env)
    }
    if (e[0] === '-'){
       return evalExp(e[1], env) -  evalExp(e[2], env)
    }
    if (e[0] === '*'){
       return evalExp(e[1], env) * evalExp(e[2], env)
    }
    if (e[0] === '/'){
       return evalExp(e[1], env) / evalExp(e[2], env)
    }
    if (e[0] === '^'){
       return Math.pow(evalExp(e[1], env), evalExp(e[2], env))
    }
    if (e[0] === '%'){
       return evalExp(e[1], env) % evalExp(e[2], env)
    }
    if (e[0] === 'sqrt'){
       return Math.sqrt(evalExp(e[1], env))
    }
    if (e[0] === 'fd'){
      console.log(state);
      var dist = evalExp(e[1] , env);
      if (window.TURTLE_IS_MOVING){
        console.log('queing forward');
        window.qdActions.push({fn: window.forward , args: [dist , state]}); 
      }
      else{
        console.log('calling fwd');
        window.forward(dist, state);
      }
    }
    if (e[0] === 'bk'){
     var dist = evalExp(e[1] , env);
     dist = dist * -1;
     window.forward(dist, state);
    }
    if (e[0] === 'lt'){
      var deg = evalExp(e[1], env)
      var rad = deg * (Math.PI / 180)
      window.turnLeft(rad, state);  
    }
    if (e[0] === 'rt'){
      var deg = evalExp(e[1], env)
      var rad = deg * (Math.PI / 180)
      if (window.TURTLE_IS_MOVING){
        console.log('qing rt');
        window.qdActions.push({fn: window.turnRight , args: [dist , state]}); 
      }   
      else{
        console.log('calling right')
        window.turnRight(rad, state);
      }   

    }
    if (e[0] === 'ti'){
      var deg = evalExp(e[1], env)
      var rad = deg * (Math.PI / 180)
      window.turnIn(rad, state);
    }
    if (e[0] === 'to'){
      var deg = evalExp(e[1], env)
      var rad = deg * (Math.PI / 180)
      window.turnOut(rad, state);
    }
    if (e[0] === 'pu'){
      window.penUp(state);
    }
    if (e[0] === 'pd'){
      window.penDown(state);
    }
    if (e[0] === 'pc'){
      window.penColor(evalExp(e[1], env), state);
    }               
    if (e[0] === '=='){
       var e1 = evalExp(e[1], env)
       var e2 = evalExp(e[2], env)
       if (e1 === e2){
         return 1
       }
       else if ( (e1 == undefined) || (e2 == undefined) ){
         if (e1 == e2){
           return 1
         }
         else {
           return 0
         }
       }
       else{
         return 0
       }
    }
    if (e[0] === '<='){
      if (evalExp(e[1], env) <= evalExp(e[2], env)){
         return 1
       }
       else{
         return 0
       }
    }
    if (e[0] === '>='){
      if (evalExp(e[1], env) >= evalExp(e[2], env)){
         return 1
       }
       else{
         return 0
       }
    }
    if (e[0] === '!='){
       var e1 = evalExp(e[1], env)
       var e2 = evalExp(e[2], env)
       if (e1 === e2){
         return 0
       }
       else if ( (e1 == undefined) || (e2 == undefined) ){
         if (e1 != e2){
           return 1
         }
         else{
           return 0
         }
       }
       else{
         return 1
       }
    }
    if (e[0] === '<'){
      if (evalExp(e[1], env) < evalExp(e[2], env)){
         return 1
       }
       else{
         return 0
       }
    }
    if (e[0] === '>'){
      if (evalExp(e[1], env) > evalExp(e[2], env)){
         return 1
       }
       else{
         return 0
       }
    }
    if (e[0] === 'call'){
      var varlist = []
      for (var i in e[2]){
        var exp = e[2][i]
        varlist.push(evalExp(exp, env))
      }
      return doCall(evalExp(e[1], env), env, varlist)
      
    }
    if (e[0] === 'update'){
      var c = new Closure(e[2], e[1], env)
      //var retClosure = new Closure(e[2], e[1], env, true)
      //setTimeout( function () {doCall(closure, env, varList)} , 1000)
      socket.on('gameStateUpdate', function(gameState){
        var visibleGameState = gameState[0]
        var returnedGameState = {}
        var shipList = {}
        var shipDict = {}
        var n = 0
        for (var i in visibleGameState){
          var name = i
          var socketId = name.substring(0, name.length - 1)
          var shipId = name.substring(name.length - 1)
          if (socketId === id){
            shipList[n] = {'x': visibleGameState[i][0] , 'y': visibleGameState[i][1], 'faction': "friendly", 'id': shipId }
            shipDict[shipId] = {'x': visibleGameState[i][0] , 'y': visibleGameState[i][1], 'faction': "friendly", 'id': shipId }
          }
          else{
            shipList[n] = {'x': visibleGameState[i][0] , 'y': visibleGameState[i][1], 'faction': "hostile", 'id': shipId }
          }
          n = n + 1
        }
        console.log("HERE IS THE RETURNED GAME STATE")
        returnedGameState['shipList'] = shipList
        returnedGameState['shipDict'] = shipDict
        console.log(returnedGameState)
        doCall(c, env, [returnedGameState])
      })

    }

    if (e[0] === 'lambda'){
      var c = new Closure(e[2], e[1], env)
      return c
    }
    if (e[0] === 'ite'){
       if ( !evalExp(e[1], env) ){
         return evalExp(e[3], env)
       }
       else{
         return evalExp(e[2], env)
       } 
    }
  }

  var evalStmt = function(stmts, env){
    var update = function(name, env, val){
      if (!(env[name] == undefined)){
        env[name] = val
      }
      else if (env["__up__"] != undefined){
        update(name, env["__up__"] , val)
      }
    }
    
    var val = null
    for ( var i in stmts){
      
      var s = stmts[i]
      if (s[0] === 'exp'){
          val = evalExp(s[1], env)
      }  
      else if (s[0] === 'def'){
          val = evalExp(s[2], env)
          env[s[1]] = val
      }
      else if (s[0] === 'print'){
        console.log('PRINTING !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        console.log(evalExp(s[1], env))
       
      }
      else if (s[0] === 'call'){
        val = doCall(evalExp(s[1], env), env, s[2])
      }
      else if (s[0] === 'asgn'){
        update(s[1], env, evalExp(s[2], env))
      }
      else if (s[0] === 'put'){
        var dict = evalExp(s[1], env)
        var index = evalExp(s[2], env)
        var value = evalExp(s[3], env)
        dict[index] = value
      }
      else if (s[0] === 'ret'){
        val = evalExp(s[1], env)
        return val
      }

    }
    return val
  }

  var doCall = function(closure, env, varList){
    var closureFrame = closure.env
    var frame = {'__up__' : closureFrame}
    var i = 0
    for (var i in closure.args){
      arg = closure.args[i]
      frame[arg] = varList[i]
      i = i+1
    }
    if (closure.recurse === true){
      setTimeout( function () {doCall(closure, env, varList)} , 1000)
      
    }
    return evalStmt(closure.body, frame)
  }
  return evalStmt(stmts, window.interpreterEnv)
}

