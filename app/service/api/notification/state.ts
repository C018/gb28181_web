// Notification Types

export type NotificationType =
  | "device_online"
  | "device_offline"
  | "stream_start"
  | "stream_stop"
  | "record_start"
  | "record_stop"
  | "error"
  | "alarm"
  | "alarm_subscribed"
  | "ai_alert";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  data: any;
  timestamp: number;
}

export type NotificationHandler = (notification: Notification) => void;
