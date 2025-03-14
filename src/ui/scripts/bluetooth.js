const noble = require('noble');
const bleno = require('bleno');

let devices = {};

// Scanning functionality (existing or new)
function startScanning(callback) {
  noble.on('stateChange', (state) => {
    if (state === 'poweredOn') {
      noble.startScanning(['fe2c'], false);
    }
  });

  noble.on('discover', (peripheral) => {
    callback({
      id: peripheral.id,
      name: peripheral.advertisement.localName || 'Unknown Device',
      rssi: peripheral.rssi
    });
  });

  return () => {
    noble.stopScanning();
  };
}

function getDevice(deviceId) {
  return noble.peripherals.find(p => p.id === deviceId);
}

// New advertising functionality
function startAdvertising(callback) {
  bleno.on('stateChange', (state) => {
    if (state === 'poweredOn') {
      bleno.startAdvertising('Nearby Share', ['fe2c']);
    }
  });

  bleno.on('accept', (clientAddress) => {
    callback(clientAddress);
  });
}

module.exports = { startScanning, getDevice, startAdvertising };