import React, { useEffect } from "react";
import { notificationService } from "~/service/api/notification/notification";
import type { Notification } from "~/service/api/notification/state";
import { toast } from "sonner";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle,
  Video,
  VideoOff,
  Circle,
  Square,
  AlertTriangle,
} from "lucide-react";

// 根据通知类型获取图标和样式
function getNotificationConfig(type: string) {
  switch (type) {
    case "device_online":
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        variant: "success" as const,
      };
    case "device_offline":
      return {
        icon: <XCircle className="h-5 w-5 text-orange-500" />,
        variant: "warning" as const,
      };
    case "stream_start":
      return {
        icon: <Video className="h-5 w-5 text-blue-500" />,
        variant: "info" as const,
      };
    case "stream_stop":
      return {
        icon: <VideoOff className="h-5 w-5 text-gray-500" />,
        variant: "default" as const,
      };
    case "record_start":
      return {
        icon: <Circle className="h-5 w-5 text-red-500" />,
        variant: "info" as const,
      };
    case "record_stop":
      return {
        icon: <Square className="h-5 w-5 text-gray-500" />,
        variant: "default" as const,
      };
    case "alarm":
    case "ai_alert":
      return {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        variant: "error" as const,
      };
    case "error":
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        variant: "error" as const,
      };
    default:
      return {
        icon: <Bell className="h-5 w-5 text-blue-500" />,
        variant: "default" as const,
      };
  }
}

// 通知监听器组件
export default function NotificationListener() {
  useEffect(() => {
    // 订阅通知
    const unsubscribe = notificationService.subscribe(
      (notification: Notification) => {
        const config = getNotificationConfig(notification.type);

        // 使用 sonner toast 显示通知
        const toastContent = (
          <div className="flex items-start gap-3">
            {config.icon}
            <div className="flex-1">
              <div className="font-medium">{notification.message}</div>
              {notification.data && (
                <div className="text-sm text-gray-600 mt-1">
                  {typeof notification.data === "string"
                    ? notification.data
                    : JSON.stringify(notification.data, null, 2)}
                </div>
              )}
            </div>
          </div>
        );

        // 根据类型显示不同的 toast
        switch (config.variant) {
          case "success":
            toast.success(toastContent);
            break;
          case "error":
            toast.error(toastContent);
            break;
          case "warning":
            toast.warning(toastContent);
            break;
          default:
            toast(toastContent);
        }
      }
    );

    // 清理订阅
    return () => {
      unsubscribe();
    };
  }, []);

  return null; // 这个组件不渲染任何内容
}
