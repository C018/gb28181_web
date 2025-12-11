// Playback Types

export interface PlaybackStartRequest {
  channel_id: string;
  start_time: number; // 开始时间戳(秒)
  end_time: number; // 结束时间戳(秒)
}

export interface PlaybackStopRequest {
  channel_id: string;
}

export interface PlaybackControlRequest {
  device_id: string;
  channel_id: string;
  action: "play" | "pause" | "scale";
  scale?: number; // 倍速 (0.5, 1, 2, 4 等)
}

export interface PlaybackRecordsRequest {
  device_id: string;
  channel_id: string;
  start_time: number; // 开始时间戳(秒)
  end_time: number; // 结束时间戳(秒)
}

export interface PlaybackStartResponse {
  stream_id: string;
  app: string;
  stream: string;
}

export interface PlaybackResponse {
  msg: string;
}

export interface PlaybackRecord {
  name: string;
  start_time: number;
  end_time: number;
  file_path?: string;
}

export interface PlaybackRecordsResponse {
  records: PlaybackRecord[];
  total: number;
}
