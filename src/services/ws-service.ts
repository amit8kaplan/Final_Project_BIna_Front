import mitt from 'mitt';
type Events = {
  message: string;
};

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private url: string = 'ws://localhost:3000';
  private emitter = mitt<Events>();
  private reconnectInterval: number = 5000;
  private maxRetries: number = 10;
  private retryCount: number = 0;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect() {
    if (this.ws) {
      console.warn('WebSocket is already connected.');
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      //console.log('Connected to the server');
      this.retryCount = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      //console.log('Message from server:', data);
      this.processMessage(data);
      this.emitter.emit('message', event.data);
    };

    this.ws.onclose = () => {
      //console.log('Disconnected from the server');
      this.ws = null;
      this.retryConnection();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.retryConnection();
    };
  }

  private processMessage(message: any) {
    if (message.closedSessions && message.closedSessions.length > 0) {
      const clientId = sessionStorage.getItem('client-id');
      if (clientId && message.closedSessions.includes(clientId)) {
        sessionStorage.removeItem('client-id');
        sessionStorage.removeItem('otp');
        sessionStorage.removeItem('ttl');
        sessionStorage.removeItem('permissions');
        //console.log('Removed session storage due to closed session:', clientId);
      }
    }
  }

  private retryConnection() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  public sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.warn('WebSocket is not open. Unable to send message.');
    }
  }

  public close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  public on(event: keyof Events, handler: (data: string) => void) {
    this.emitter.on(event, handler);
  }

  public off(event: keyof Events, handler: (data: string) => void) {
    this.emitter.off(event, handler);
  }
}

export default WebSocketService;
