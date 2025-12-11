import http from "~/service/config/http";
import type {
  PlaybackStartRequest,
  PlaybackStopRequest,
  PlaybackControlRequest,
  PlaybackRecordsRequest,
  PlaybackStartResponse,
  PlaybackResponse,
  PlaybackRecordsResponse,
} from "./state";

// 开始录像回放
export async function StartPlayback(data: PlaybackStartRequest) {
  return http.post<PlaybackStartResponse>("/playback/start", data);
}

// 停止录像回放
export async function StopPlayback(data: PlaybackStopRequest) {
  return http.post<PlaybackResponse>("/playback/stop", data);
}

// 回放控制
export async function ControlPlayback(data: PlaybackControlRequest) {
  return http.post<PlaybackResponse>("/playback/control", data);
}

// 查询设备端录像
export async function GetPlaybackRecords(params: PlaybackRecordsRequest) {
  return http.get<PlaybackRecordsResponse>("/playback/records", { params });
}
