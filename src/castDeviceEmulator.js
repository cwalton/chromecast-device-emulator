const WebSocket = require('ws');

class CastDeviceEmulator {
  constructor() {
    this.wss = new WebSocket.Server({
      port: 8008,
      path: '/v2/ipc'
    });
    this.recordedMessages = [];
    this._webSocketMessageHandler = this._webSocketMessageHandler.bind(this);
    this._webSocketConnectionHandler = this._webSocketConnectionHandler.bind(
      this
    );
  }
  loadScript(messages) {
    this.recordedMessages = messages;
  }
  start() {
    if (!this.wss) {
      throw new Error('WebSocket was not ready.');
    }
    // Starting to handle websocket connections
    this.wss.on('connection', this._webSocketConnectionHandler);
    console.log('Chromecast Device Emulator is waiting for connections..');
  }
  stop() {
    this.wss.removeAllListeners('message');
    this.wss.removeAllListeners('connection');
  }
  _webSocketConnectionHandler(ws) {
    console.log('There is a cast client just connected.');
    // Registering for message handler
    ws.on('message', this._webSocketMessageHandler);
    // Setting-up recorded message callback
    this.recordedMessages.map(m => {
      const sendRecordedMessage = () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(m.message);
        }
      };
      setTimeout(sendRecordedMessage, m.time);
    });
  }
  _webSocketMessageHandler(message) {
    console.log('received: %s', message);
  }
}

export default CastDeviceEmulator;
