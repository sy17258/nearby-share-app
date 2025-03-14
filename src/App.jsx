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
          <view className='Logo' onClick={onTap}>
            {alterLogo
              ? <image src={reactLynxLogo} className='Logo--react' />
              : <image src={lynxLogo} className='Logo--lynx' />}
          </view>
          <text className='Title'>Nearby Share App</text>
          <text className='Subtitle'>File Transfer between Mac and Android</text>
        </view>
        
        <view className='Content' style={{ width: '100%', padding: '0 20px' }}>
          {/* Scan Button */}
          <view 
            onClick={startScanning}
            style={{
              backgroundColor: '#4285f4',
              padding: '15px',
              borderRadius: '8px',
              margin: '10px 0',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
              Start Scanning
            </text>
          </view>
          
          {/* Device List */}
          {devices.length > 0 && (
            <view style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '10px',
              margin: '10px 0'
            }}>
              <text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                Available Devices:
              </text>
              
              {devices.map((device) => (
                <view 
                  key={device.id} 
                  onClick={() => selectDevice(device)}
                  style={{ 
                    backgroundColor: selectedDevice?.id === device.id ? 'rgba(66, 133, 244, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '6px',
                    margin: '5px 0',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <text style={{ color: 'white', fontSize: '14px' }}>{device.name}</text>
                  
                  {selectedDevice?.id === device.id && (
                    <view style={{ 
                      width: '16px', 
                      height: '16px', 
                      borderRadius: '8px', 
                      backgroundColor: '#34a853' 
                    }} />
                  )}
                </view>
              ))}
            </view>
          )}
          
          {/* File Picker Button */}
          <view 
            onClick={pickFile}
            style={{
              backgroundColor: '#34a853',
              padding: '15px',
              borderRadius: '8px',
              margin: '10px 0',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
              Pick File
            </text>
          </view>
          
          {/* Selected File Display */}
          {fileToSend && (
            <view style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '10px',
              borderRadius: '6px',
              margin: '10px 0'
            }}>
              <text style={{ color: 'white', fontSize: '14px' }}>
                Selected File: {fileToSend}
              </text>
            </view>
          )}
          
          {/* Send File Button */}
          <view 
            onClick={sendFile}
            style={{
              backgroundColor: (!selectedDevice || !fileToSend) ? '#cccccc' : '#ea4335',
              padding: '15px',
              borderRadius: '8px',
              margin: '10px 0',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: (!selectedDevice || !fileToSend) ? 0.5 : 1
            }}
          >
            <text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
              Send File
            </text>
          </view>
          
          {/* Incoming Transfers Section */}
          {incomingTransfers.length > 0 && (
            <view style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '10px',
              margin: '15px 0'
            }}>
              <text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                Incoming Transfers:
              </text>
              
              {incomingTransfers.map((transfer) => (
                <view 
                  key={transfer.id}
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '6px',
                    margin: '5px 0'
                  }}
                >
                  <text style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>
                    {transfer.fileName} ({(transfer.size / (1024 * 1024)).toFixed(1)} MB)
                  </text>
                  <text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '10px' }}>
                    From: {transfer.sender}
                  </text>
                  
                  <view style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <view 
                      onClick={() => acceptTransfer(transfer.id)}
                      style={{
                        backgroundColor: '#34a853',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        marginRight: '8px'
                      }}
                    >
                      <text style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                        Accept
                      </text>
                    </view>
                    
                    <view 
                      onClick={() => rejectTransfer(transfer.id)}
                      style={{
                        backgroundColor: '#ea4335',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1
                      }}
                    >
                      <text style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                        Reject
                      </text>
                    </view>
                  </view>
                </view>
              ))}
            </view>
          )}
        </view>
        
        <view style={{ flex: 1 }}></view>
      </view>
    </view>
  )
}