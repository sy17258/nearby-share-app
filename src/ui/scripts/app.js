const { startScanning, startAdvertising, getDevice } = require('./bluetooth');
const { startServer } = require('./network');
const { sendFile, receiveFile } = require('./fileTransfer');

document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('send-btn');
  const receiveBtn = document.getElementById('receive-btn');
  const deviceList = document.getElementById('device-list');
  const filePicker = document.getElementById('file-picker');
  const sendStatus = document.getElementById('send-status');
  const receiveStatus = document.getElementById('receive-status');

  sendBtn.addEventListener('click', () => {
    startScanning((name, id) => {
      const option = document.createElement('option');
      option.value = id;
      option.text = name;
      deviceList.appendChild(option);
    });
    sendStatus.textContent = 'Scanning for devices...';
  });

  deviceList.addEventListener('change', () => {
    if (filePicker.files.length > 0) {
      const filePath = filePicker.files[0].path;
      const deviceId = deviceList.value;
      const device = getDevice(deviceId);
      // Placeholder IP/port; in practice, exchange via BLE
      sendFile(filePath, '192.168.1.100', 12345, (msg) => {
        sendStatus.textContent = msg;
      });
    }
  });

  receiveBtn.addEventListener('click', () => {
    startAdvertising(() => {
      startServer(12345, (socket) => {
        receiveFile(socket, '~/Downloads/received_file', (msg) => {
          receiveStatus.textContent = msg;
        });
      });
    });
    receiveStatus.textContent = 'Waiting for incoming files...';
  });
});