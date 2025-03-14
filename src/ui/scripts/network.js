const net = require('net');
const tls = require('tls');

function connectToDevice(ip, port, callback) {
  const socket = tls.connect(port, ip, () => {
    callback(socket);
  });
  socket.on('error', (err) => console.error('Connection error:', err));
}

function startServer(port, callback) {
  const server = net.createServer((socket) => {
    callback(socket);
  });
  server.listen(port, () => console.log(`Server listening on port ${port}`));
}

module.exports = { connectToDevice, startServer };