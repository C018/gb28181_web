import { POST } from "~/service/config/http";
import type {
  PTZControlRequest,
  PTZPresetRequest,
  PTZControlResponse,
} from "./state";

// PTZ方向控制
export async function PTZControl(data: PTZControlRequest) {
  return POST<PTZControlResponse>("/ptz/control", data);
}

// PTZ预置位控制
export async function PTZPreset(data: PTZPresetRequest) {
  return POST<PTZControlResponse>("/ptz/preset", data);
}
