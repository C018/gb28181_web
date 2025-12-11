// Alarm Types

export interface AlarmSubscribeRequest {
  device_id: string;
  expire_seconds?: number; // 订阅有效期(秒), 默认 3600
}

export interface AlarmUnsubscribeRequest {
  device_id: string;
}

export interface AlarmResponse {
  msg: string;
  expires?: number;
}
