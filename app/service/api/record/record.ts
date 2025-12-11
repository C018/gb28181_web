import { POST, GET } from "~/service/config/http";
import type {
  RecordStartRequest,
  RecordStopRequest,
  RecordStatusRequest,
  RecordFilesRequest,
  RecordResponse,
  RecordStatusResponse,
  RecordFilesResponse,
} from "./state";

// 开始录像
export async function StartRecord(data: RecordStartRequest) {
  return POST<RecordResponse>("/records/start", data);
}

// 停止录像
export async function StopRecord(data: RecordStopRequest) {
  return POST<RecordResponse>("/records/stop", data);
}

// 获取录像状态
export async function GetRecordStatus(params: RecordStatusRequest) {
  return GET<RecordStatusResponse>("/records/status", params);
}

// 获取录像文件列表
export async function GetRecordFiles(params: RecordFilesRequest) {
  return GET<RecordFilesResponse>("/records/files", params);
}
