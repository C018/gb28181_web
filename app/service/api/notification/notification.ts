import type { Notification, NotificationHandler } from "./state";

// SSE 连接管理
class NotificationService {
  private eventSource: EventSource | null = null;
  private handlers: NotificationHandler[] = [];
  private baseURL: string;

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
    const url = `${this.baseURL}/api/notifications/subscribe?token=${token}`;

    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        this.handlers.forEach((handler) => handler(notification));
      } catch (error) {
        console.error("Failed to parse notification:", error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      // 自动重连
      setTimeout(() => {
        if (this.handlers.length > 0) {
          this.disconnect();
          this.connect();
        }
      }, 5000);
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
