var http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    usercount = 0;

app.set('view engine', 'ejs')
app.set('view options', {layout: false})
app.set('views', __dirname + "/views")
app.use("/static", express.static(__dirname + "/static"))

app.get('/', function(req, res) {
    res.render('index');
});

server.listen(8080);

io.set('log level', 1);
io.sockets.on('connection', function(socket) {
    usercount++;
    io.sockets.emit('usercount', usercount);
    socket.on('disconnect', function() {
        usercount--;
        io.sockets.emit('usercount', usercount);
    });
    socket.on('drawLine', function(args) {
        socket.broadcast.emit('drawLine', args);
    });
});