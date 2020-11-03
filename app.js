const { createServer } = require('http')
const { createReadStream } = require('fs')

createServer(function (_req, res) {
  res.writeHead(200, { 'content-type': 'text/html' })
  createReadStream('index.html').pipe(res)
}).listen(8080);

const io = require('socket.io')
const server = io.listen(8081)

let count = 0

server.on('connection', (ws) => {
  ws.active = false

  ws.on('touch', (message) => {
    ws.active = !ws.active
    count += ws.active ? 1 : -1
    server.sockets.emit('count', count)
  })

  ws.on('disconnect', () => {
    if (ws.active) {
      count--
      server.sockets.emit('count', count)
    }
  })

  ws.emit('count', count)
})
