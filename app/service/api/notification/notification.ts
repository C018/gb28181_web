import type { Notification, NotificationHandler } from "./state";

// SSE 连接管理
class NotificationService {
  private eventSource: EventSource | null = null;
  private handlers: NotificationHandler[] = [];
  private baseURL: string;
  private reconnectDelay = 5000; // Initial reconnect delay
  private maxReconnectDelay = 60000; // Maximum reconnect delay (1 minute)
  private currentReconnectDelay = 5000;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || "";
  }

  // 订阅实时通知
  subscribe(handler: NotificationHandler): () => void {
    this.handlers.push(handler);

    // 如果还没有连接，创建连接
    if (!this.eventSource) {
      this.connect();
    }

    // 返回取消订阅函数
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
      // 如果没有订阅者了，关闭连接
      if (this.handlers.length === 0) {
        this.disconnect();
      }
    };
  }

  // 建立 SSE 连接
  private connect() {
    const token = localStorage.getItem("token");
    
    // Create URL without token in query string for better security
    // Note: EventSource doesn't support custom headers, so we'll use a workaround
    // by creating a temporary connection endpoint that validates the token
    const url = `${this.baseURL}/api/notifications/subscribe`;
    
    // For now, using query param as EventSource API limitation
    // TODO: Consider implementing WebSocket for better security
    const urlWithAuth = `${url}?token=${token}`;

    this.eventSource = new EventSource(urlWithAuth);

    this.eventSource.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        this.handlers.forEach((handler) => handler(notification));
        // Reset reconnect delay on successful message
        this.currentReconnectDelay = this.reconnectDelay;
      } catch (error) {
        console.error("Failed to parse notification:", error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      // Exponential backoff for reconnection
      setTimeout(() => {
        if (this.handlers.length > 0) {
          this.disconnect();
          this.connect();
          // Increase delay for next reconnection, up to max
          this.currentReconnectDelay = Math.min(
            this.currentReconnectDelay * 2,
            this.maxReconnectDelay
          );
        }
      }, this.currentReconnectDelay);
    };
  }

  // 断开 SSE 连接
  private disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

// 导出单例
export const notificationService = new NotificationService();
