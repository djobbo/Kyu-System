Fix `Failed to construct 'WebSocket'`  
Edit `node_modules/react-dev-utils/webpackHotDevClient.js` to fix this problem without downgrading to 3.2.  
Line 62: `protocol: window.location.protocol === 'https:' ? 'wss' : 'ws',`