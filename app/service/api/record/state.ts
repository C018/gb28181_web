// Recording Management Types

export interface RecordStartRequest {
  app: string;
  stream: string;
  type?: number; // 0: HLS, 1: MP4
  max_second?: number; // MP4录像切片时间大小，单位秒
  customized_path?: string; // 录像文件保存自定义根目录
}

export interface RecordStopRequest {
  app: string;
  stream: string;
  type?: number; // 0: HLS, 1: MP4
}

export interface RecordStatusRequest {
  app: string;
  stream: string;
  type?: number; // 0: HLS, 1: MP4
}

export interface RecordFilesRequest {
  app: string;
  stream: string;
  period: string; // 日期，格式为 2020-02-01
  customize?: string; // 是否为自定义路径录像
}

export interface RecordResponse {
  msg: string;
}

export interface RecordStatusResponse {
  status: boolean;
}

export interface RecordFilesResponse {
  root_path: string;
  paths: string[];
  folders: string[];
}
