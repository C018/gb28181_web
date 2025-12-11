import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Circle,
  Focus,
  Sun,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { PTZControl, PTZPreset } from "~/service/api/ptz/ptz";
import type { PTZCommand } from "~/service/api/ptz/state";
import { ErrorHandle } from "~/service/config/error";
import { toastSuccess } from "~/components/xui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";

interface PTZControlPanelProps {
  deviceId: string;
  channelId: string;
}

export default function PTZControlPanel({
  deviceId,
  channelId,
}: PTZControlPanelProps) {
  const [speed, setSpeed] = useState(50);
  const [presetIndex, setPresetIndex] = useState(1);

  // PTZ 控制
  const { mutate: controlMutate, isPending: isControlPending } = useMutation({
    mutationFn: PTZControl,
    onSuccess: () => {
      // toastSuccess("控制成功");
    },
    onError: ErrorHandle,
  });

  // 预置位控制
  const { mutate: presetMutate, isPending: isPresetPending } = useMutation({
    mutationFn: PTZPreset,
    onSuccess: () => {
      toastSuccess("预置位操作成功");
    },
    onError: ErrorHandle,
  });

  const handlePTZControl = (command: PTZCommand) => {
    controlMutate({
      device_id: deviceId,
      channel_id: channelId,
      command,
      speed,
    });
  };

  const handlePreset = (action: "set" | "call" | "delete") => {
    presetMutate({
      device_id: deviceId,
      channel_id: channelId,
      action,
      preset_index: presetIndex,
    });
  };

  const isPending = isControlPending || isPresetPending;

  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div className="text-sm font-medium">云台控制</div>

      {/* 速度控制 */}
      <div className="space-y-2">
        <Label className="text-xs">速度: {speed}</Label>
        <Slider
          value={[speed]}
          onValueChange={(v) => setSpeed(v[0])}
          min={0}
          max={255}
          step={1}
          className="w-full"
        />
      </div>

      {/* 方向控制 */}
      <div className="grid grid-cols-3 gap-2">
        {/* 左上 */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("left_up")}
          disabled={isPending}
          className="h-10"
        >
          ↖
        </Button>
        {/* 上 */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("up")}
          disabled={isPending}
          className="h-10"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        {/* 右上 */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("right_up")}
          disabled={isPending}
          className="h-10"
        >
          ↗
        </Button>

        {/* 左 */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("left")}
          disabled={isPending}
          className="h-10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {/* 停止 */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("stop")}
          disabled={isPending}
          className="h-10"
        >
          <Circle className="h-4 w-4" />
        </Button>
        {/* 右 */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("right")}
          disabled={isPending}
          className="h-10"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>

        {/* 左下 */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("left_down")}
          disabled={isPending}
          className="h-10"
        >
          ↙
        </Button>
        {/* 下 */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("down")}
          disabled={isPending}
          className="h-10"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        {/* 右下 */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("right_down")}
          disabled={isPending}
          className="h-10"
        >
          ↘
        </Button>
      </div>

      {/* 变倍控制 */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("zoom_in")}
          disabled={isPending}
        >
          <ZoomIn className="h-4 w-4 mr-1" />
          放大
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("zoom_out")}
          disabled={isPending}
        >
          <ZoomOut className="h-4 w-4 mr-1" />
          缩小
        </Button>
      </div>

      {/* 光圈控制 */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("iris_in")}
          disabled={isPending}
        >
          <Sun className="h-4 w-4 mr-1" />
          光圈开
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("iris_out")}
          disabled={isPending}
        >
          <Sun className="h-4 w-4 mr-1" />
          光圈关
        </Button>
      </div>

      {/* 聚焦控制 */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("focus_in")}
          disabled={isPending}
        >
          <Focus className="h-4 w-4 mr-1" />
          聚焦近
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePTZControl("focus_out")}
          disabled={isPending}
        >
          <Focus className="h-4 w-4 mr-1" />
          聚焦远
        </Button>
      </div>

      {/* 预置位控制 */}
      <div className="space-y-2 pt-2 border-t">
        <Label className="text-xs">预置位</Label>
        <Select
          value={presetIndex.toString()}
          onValueChange={(v) => setPresetIndex(Number(v))}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
              <SelectItem key={i} value={i.toString()}>
                预置位 {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePreset("set")}
            disabled={isPending}
          >
            设置
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePreset("call")}
            disabled={isPending}
          >
            调用
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePreset("delete")}
            disabled={isPending}
          >
            删除
          </Button>
        </div>
      </div>
    </div>
  );
}
