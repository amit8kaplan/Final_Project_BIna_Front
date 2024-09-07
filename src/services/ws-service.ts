import mitt from 'mitt';

type Events = {
  message: string;
};

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private url: string = 'ws://localhost:3000';
  private emitter = mitt<Events>();
  private reconnectInterval: number = 5000; // 5 seconds
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
      console.log('Connected to the server');
      this.retryCount = 0; // Reset retry count on successful connection
    };

    this.ws.onmessage = (event) => {
      console.log('Message from server:', event.data);
      this.emitter.emit('message', event.data); // Emit the message event
    };

    this.ws.onclose = () => {
      console.log('Disconnected from the server');
      this.ws = null;
      this.retryConnection();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.retryConnection();
    };
  }

  private retryConnection() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Retrying connection in ${this.reconnectInterval / 1000} seconds... (Attempt ${this.retryCount}/${this.maxRetries})`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error('Max retries reached. Unable to connect to WebSocket server.');
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