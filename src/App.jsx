import { useCallback, useEffect, useState } from '@lynx-js/react'
import './App.css'
import reactLynxLogo from './assets/react-logo.png'
import lynxLogo from './assets/lynx-logo.png'
import arrow from './assets/arrow.png'

// Create a mock NearbyShareModule since NativeModules is not available
const NearbyShareModule = {
  init: () => {
    console.log('NearbyShareModule initialized');
    return true;
  },
  on: (event, callback) => {
    console.log(`Registered listener for ${event}`);
    // Mock event listener
    if (event === 'incomingTransfer') {
      // Simulate an incoming transfer after 5 seconds
      setTimeout(() => {
        callback({
          id: 'transfer-123',
          fileName: 'example.pdf',
          size: 1024 * 1024 * 2, // 2MB
          sender: 'Device-ABC'
        });
      }, 5000);
    }
  },
  startScanning: (callback) => {
    console.log('Started scanning for devices');
    // Simulate finding devices
    setTimeout(() => {
      callback({
        id: 'device-1',
        name: 'Android Phone'
      });
    }, 2000);
    setTimeout(() => {
      callback({
        id: 'device-2',
        name: 'MacBook Pro'
      });
    }, 3500);
  },
  sendFile: (filePath, deviceId) => {
    console.log(`Sending file ${filePath} to device ${deviceId}`);
    return true;
  },
  acceptTransfer: (transferId) => {
    console.log(`Accepting transfer ${transferId}`);
    return true;
  },
  rejectTransfer: (transferId) => {
    console.log(`Rejecting transfer ${transferId}`);
    return true;
  }
};

export function App() {
  const [alterLogo, setAlterLogo] = useState(false)
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [fileToSend, setFileToSend] = useState(null)
  const [incomingTransfers, setIncomingTransfers] = useState([])
  
  // Use the mock module instead of trying to get it from NativeModules
  useEffect(() => {
    console.info('Hello, ReactLynx')
    NearbyShareModule.init()
    NearbyShareModule.on('incomingTransfer', (transfer) => {
      setIncomingTransfers((prev) => [...prev, transfer])
    })
  }, [])

  const onTap = useCallback(() => {
    setAlterLogo(!alterLogo)
  }, [alterLogo])

  const startScanning = () => {
    NearbyShareModule.startScanning((device) => {
      setDevices((prev) => [...prev, device])
    })
  }

  const selectDevice = (device) => {
    setSelectedDevice(device)
  }

  const pickFile = () => {
    setFileToSend('path/to/selected/file') // Placeholder; implement file picker
  }

  const sendFile = () => {
    if (selectedDevice && fileToSend) {
      NearbyShareModule.sendFile(fileToSend, selectedDevice.id)
    }
  }

  const acceptTransfer = (transferId) => {
    NearbyShareModule.acceptTransfer(transferId)
  }

  const rejectTransfer = (transferId) => {
    NearbyShareModule.rejectTransfer(transferId)
  }

  return (
    <view>
      <view className='Background' />
      <view className='App'>
        <view className='Banner'>
          <view className='Logo' bindtap={onTap}>
            {alterLogo
              ? <image src={reactLynxLogo} className='Logo--react' />
              : <image src={lynxLogo} className='Logo--lynx' />}
          </view>
          <text className='Title'>Nearby Share App</text>
          <text className='Subtitle'>File Transfer between Mac and Android</text>
        </view>
        <view className='Content'>
          <button onClick={startScanning}>Start Scanning</button>
          <list>
            {devices.map((device) => (
              <item key={device.id} onClick={() => selectDevice(device)}>
                {device.name}
              </item>
            ))}
          </list>
          <button onClick={pickFile}>Pick File</button>
          {fileToSend && <text>Selected File: {fileToSend}</text>}
          <button onClick={sendFile} disabled={!selectedDevice || !fileToSend}>Send File</button>
          <view>
            <text>Incoming Transfers:</text>
            {incomingTransfers.map((transfer) => (
              <view key={transfer.id}>
                <text>{transfer.fileName}</text>
                <button onClick={() => acceptTransfer(transfer.id)}>Accept</button>
                <button onClick={() => rejectTransfer(transfer.id)}>Reject</button>
              </view>
            ))}
          </view>
        </view>
        <view style={{ flex: 1 }}></view>
      </view>
    </view>
  )
}