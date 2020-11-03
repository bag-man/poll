const app = require('http').createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' })
    createReadStream('index.html').pipe(res)
  })
const io = require('socket.io')(app);
const { createReadStream } = require('fs')


app.listen(8888);

let count = 0

io.on('connection', (ws) => {
  ws.active = false

  ws.on('touch', () => {
    ws.active = !ws.active
    count += ws.active ? 1 : -1
    io.sockets.emit('count', count)
  })

  ws.on('disconnect', () => {
    if (ws.active) {
      count--
      io.sockets.emit('count', count)
    }
  })

  ws.emit('count', count)
})

