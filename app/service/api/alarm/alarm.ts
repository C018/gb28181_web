import { POST } from "~/service/config/http";
import type {
  AlarmSubscribeRequest,
  AlarmUnsubscribeRequest,
  AlarmResponse,
} from "./state";

// 订阅报警事件
export async function SubscribeAlarm(data: AlarmSubscribeRequest) {
  return POST<AlarmResponse>("/alarms/subscribe", data);
}

// 取消报警订阅
export async function UnsubscribeAlarm(data: AlarmUnsubscribeRequest) {
  return POST<AlarmResponse>("/alarms/unsubscribe", data);
}
