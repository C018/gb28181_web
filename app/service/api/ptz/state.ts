// PTZ Control Types

export interface PTZControlRequest {
  device_id: string;
  channel_id: string;
  command: PTZCommand;
  speed?: number; // 0-255, default 50
}

export type PTZCommand =
  | "stop"
  | "left"
  | "right"
  | "up"
  | "down"
  | "zoom_in"
  | "zoom_out"
  | "left_up"
  | "left_down"
  | "right_up"
  | "right_down"
  | "iris_in"
  | "iris_out"
  | "focus_in"
  | "focus_out";

export interface PTZPresetRequest {
  device_id: string;
  channel_id: string;
  action: "set" | "call" | "delete";
  preset_index: number; // 1-255
}

export interface PTZControlResponse {
  msg: string;
}
