import http from "~/service/config/http";
import type {
  PTZControlRequest,
  PTZPresetRequest,
  PTZControlResponse,
} from "./state";

// PTZ方向控制
export async function PTZControl(data: PTZControlRequest) {
  return http.post<PTZControlResponse>("/ptz/control", data);
}

// PTZ预置位控制
export async function PTZPreset(data: PTZPresetRequest) {
  return http.post<PTZControlResponse>("/ptz/preset", data);
}
