const fs = require('fs');
const { connectToDevice } = require('./network');

function sendFile(filePath, ip, port, updateStatus) {
  const fileStream = fs.createReadStream(filePath);
  connectToDevice(ip, port, (socket) => {
    fileStream.pipe(socket);
    let progress = 0;
    const totalSize = fs.statSync(filePath).size;
    fileStream.on('data', (chunk) => {
      progress += chunk.length;
      updateStatus(`Sending: ${Math.round((progress / totalSize) * 100)}%`);
    });
    socket.on('end', () => updateStatus('File sent successfully'));
  });
}

function receiveFile(socket, savePath, updateStatus) {
  const fileStream = fs.createWriteStream(savePath);
  socket.pipe(fileStream);
  socket.on('data', () => updateStatus('Receiving file...'));
  socket.on('end', () => updateStatus('File received successfully'));
}

module.exports = { sendFile, receiveFile };