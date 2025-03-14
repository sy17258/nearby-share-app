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
    // Return a cleanup function to prevent memory leaks
    return () => {
      console.log(`Removed listener for ${event}`);
    };
  },
  startScanning: (callback) => {
    console.log('Started scanning for devices');
    // Simulate finding devices
    const timeout1 = setTimeout(() => {
      callback({
        id: 'device-1',
        name: 'Android Phone'
      });
    }, 2000);
    const timeout2 = setTimeout(() => {
      callback({
        id: 'device-2',
        name: 'MacBook Pro'
      });
    }, 3500);
    
    // Return a cleanup function
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      console.log('Stopped scanning');
    };
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
  const [showUI, setShowUI] = useState(false)
  
  // Use the mock module instead of trying to get it from NativeModules
  useEffect(() => {
    console.info('Hello, ReactLynx')
    try {
      NearbyShareModule.init()
      const cleanup = NearbyShareModule.on('incomingTransfer', (transfer) => {
        setIncomingTransfers((prev) => [...prev, transfer])
      })
      
      // Show UI after a short delay to ensure splash screen is visible
      const timer = setTimeout(() => {
        setShowUI(true);
      }, 2000);
      
      // Return cleanup function
      return () => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
        clearTimeout(timer);
      };
    } catch (error) {
      console.error('Error initializing NearbyShareModule:', error);
    }
  }, [])

  const onTap = useCallback(() => {
    setAlterLogo(!alterLogo)
  }, [alterLogo])

  const startScanning = () => {
    try {
      const stopScanning = NearbyShareModule.startScanning((device) => {
        setDevices((prev) => {
          // Avoid duplicate devices
          if (prev.some(d => d.id === device.id)) {
            return prev;
          }
          return [...prev, device];
        });
      });
    } catch (error) {
      console.error('Error starting scanning:', error);
    }
  }

  const selectDevice = (device) => {
    setSelectedDevice(device)
  }

  const pickFile = () => {
    setFileToSend('path/to/selected/file') // Placeholder; implement file picker
  }

  const sendFile = () => {
    if (selectedDevice && fileToSend) {
      try {
        NearbyShareModule.sendFile(fileToSend, selectedDevice.id)
      } catch (error) {
        console.error('Error sending file:', error);
      }
    }
  }

  const acceptTransfer = (transferId) => {
    try {
      NearbyShareModule.acceptTransfer(transferId)
    } catch (error) {
      console.error('Error accepting transfer:', error);
    }
  }

  const rejectTransfer = (transferId) => {
    try {
      NearbyShareModule.rejectTransfer(transferId)
    } catch (error) {
      console.error('Error rejecting transfer:', error);
    }
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
        
        {showUI && (
          <view className='Content'>
            <button 
              onClick={startScanning}
              style={{
                padding: '10px 20px',
                margin: '10px 0',
                backgroundColor: '#4285f4',
                color: 'white',
                borderRadius: '4px'
              }}
            >
              Start Scanning
            </button>
            
            {devices.length > 0 && (
              <view style={{ width: '100%', margin: '10px 0' }}>
                <text style={{ fontWeight: 'bold', marginBottom: '5px' }}>Available Devices:</text>
                {devices.map((device) => (
                  <view 
                    key={device.id} 
                    onClick={() => selectDevice(device)}
                    style={{ 
                      padding: '8px', 
                      margin: '4px 0',
                      backgroundColor: selectedDevice?.id === device.id ? '#e8f0fe' : 'transparent',
                      borderRadius: '4px'
                    }}
                  >
                    <text>{device.name}</text>
                  </view>
                ))}
              </view>
            )}
            
            <button 
              onClick={pickFile}
              style={{ 
                padding: '10px 20px', 
                margin: '10px 0',
                backgroundColor: '#34a853',
                color: 'white',
                borderRadius: '4px'
              }}
            >
              Pick File
            </button>
            
            {fileToSend && (
              <text style={{ margin: '5px 0' }}>Selected File: {fileToSend}</text>
            )}
            
            <button 
              onClick={sendFile} 
              disabled={!selectedDevice || !fileToSend}
              style={{ 
                padding: '10px 20px', 
                margin: '10px 0',
                backgroundColor: (!selectedDevice || !fileToSend) ? '#cccccc' : '#ea4335',
                color: 'white',
                borderRadius: '4px',
                opacity: (!selectedDevice || !fileToSend) ? 0.5 : 1
              }}
            >
              Send File
            </button>
            
            {incomingTransfers.length > 0 && (
              <view style={{ width: '100%', margin: '15px 0' }}>
                <text style={{ fontWeight: 'bold', marginBottom: '5px' }}>Incoming Transfers:</text>
                {incomingTransfers.map((transfer) => (
                  <view 
                    key={transfer.id}
                    style={{ 
                      padding: '10px', 
                      margin: '5px 0',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px'
                    }}
                  >
                    <text style={{ marginBottom: '5px' }}>{transfer.fileName}</text>
                    <view style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button 
                        onClick={() => acceptTransfer(transfer.id)}
                        style={{ 
                          padding: '5px 10px', 
                          backgroundColor: '#34a853',
                          color: 'white',
                          borderRadius: '4px',
                          marginRight: '5px'
                        }}
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => rejectTransfer(transfer.id)}
                        style={{ 
                          padding: '5px 10px', 
                          backgroundColor: '#ea4335',
                          color: 'white',
                          borderRadius: '4px'
                        }}
                      >
                        Reject
                      </button>
                    </view>
                  </view>
                ))}
              </view>
            )}
          </view>
        )}
        
        <view style={{ flex: 1 }}></view>
      </view>
    </view>
  )
}