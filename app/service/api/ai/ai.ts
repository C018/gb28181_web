import { POST, GET, PUT, DELETE } from "~/service/config/http";
import type {
  AIDetectRequest,
  AIDetectResponse,
  AIRuleCreateRequest,
  AIRule,
  AIRulesResponse,
  AIStatusResponse,
} from "./state";

// 执行 AI 检测
export async function DetectAI(data: AIDetectRequest) {
  return POST<AIDetectResponse>("/ai/detect", data);
}

// 获取告警规则列表
export async function GetAIRules() {
  return GET<AIRulesResponse>("/ai/rules");
}

// 创建告警规则
export async function CreateAIRule(data: AIRuleCreateRequest) {
  return POST<AIRule>("/ai/rules", data);
}

// 获取告警规则详情
export async function GetAIRule(id: string) {
  return GET<AIRule>(`/ai/rules/${id}`);
}

// 更新告警规则
export async function UpdateAIRule(id: string, data: Partial<AIRuleCreateRequest>) {
  return PUT<AIRule>(`/ai/rules/${id}`, data);
}

// 删除告警规则
export async function DeleteAIRule(id: string) {
  return DELETE(`/ai/rules/${id}`);
}

// 获取 AI 服务状态
export async function GetAIStatus() {
  return GET<AIStatusResponse>("/ai/status");
}
