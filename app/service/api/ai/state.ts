// AI Detection Types

export interface AIDetectRequest {
  channel_id: string;
  image_data: string; // Base64 编码的图片数据
  type?: string; // 检测类型: pedestrian/vehicle/face/object
}

export interface AIDetectionResult {
  label: string;
  confidence: number;
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AIDetectResponse {
  success: boolean;
  results: AIDetectionResult[];
  process_time_ms: number;
  alerts: any[];
}

export interface AIRule {
  id: string;
  channel_id: string;
  detection_type: string;
  enabled: boolean;
  threshold: number;
  cooldown_seconds: number;
  region?: any;
}

export interface AIRuleCreateRequest {
  channel_id: string;
  detection_type: string;
  enabled?: boolean;
  threshold?: number; // 0-1, 默认 0.5
  cooldown_seconds?: number; // 默认 60
  region?: any;
}

export interface AIRulesResponse {
  rules: AIRule[];
}

export interface AIStatusResponse {
  enabled: boolean;
  inference_mode: string;
  endpoint: string;
  model_type: string;
  rule_count: number;
}
