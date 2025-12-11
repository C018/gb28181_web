import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Play, Pause, Square, FastForward, Rewind } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  StartPlayback,
  StopPlayback,
  ControlPlayback,
} from "~/service/api/playback/playback";
import { ErrorHandle } from "~/service/config/error";
import { toastSuccess } from "~/components/xui/toast";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";

interface PlaybackControlPanelProps {
  deviceId: string;
  channelId: string;
}

export default function PlaybackControlPanel({
  deviceId,
  channelId,
}: PlaybackControlPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // 开始回放
  const { mutate: startMutate, isPending: isStartPending } = useMutation({
    mutationFn: StartPlayback,
    onSuccess: () => {
      toastSuccess("回放已开始");
      setIsPlaying(true);
    },
    onError: ErrorHandle,
  });

  // 停止回放
  const { mutate: stopMutate, isPending: isStopPending } = useMutation({
    mutationFn: StopPlayback,
    onSuccess: () => {
      toastSuccess("回放已停止");
      setIsPlaying(false);
    },
    onError: ErrorHandle,
  });

  // 回放控制（暂停/继续/倍速）
  const { mutate: controlMutate, isPending: isControlPending } = useMutation({
    mutationFn: ControlPlayback,
    onSuccess: (_, variables) => {
      if (variables.action === "pause") {
        toastSuccess("已暂停");
      } else if (variables.action === "play") {
        toastSuccess("继续播放");
      } else if (variables.action === "scale") {
        toastSuccess(`倍速: ${variables.scale}x`);
      }
    },
    onError: ErrorHandle,
  });

  const handleStartPlayback = () => {
    if (!startTime || !endTime) {
      ErrorHandle(new Error("请选择开始和结束时间"));
      return;
    }

    const start = new Date(startTime).getTime() / 1000;
    const end = new Date(endTime).getTime() / 1000;

    if (start >= end) {
      ErrorHandle(new Error("开始时间必须早于结束时间"));
      return;
    }

    startMutate({
      channel_id: channelId,
      start_time: start,
      end_time: end,
    });
  };

  const handleStopPlayback = () => {
    stopMutate({
      channel_id: channelId,
    });
  };

  const handlePause = () => {
    controlMutate({
      device_id: deviceId,
      channel_id: channelId,
      action: "pause",
    });
  };

  const handlePlay = () => {
    controlMutate({
      device_id: deviceId,
      channel_id: channelId,
      action: "play",
    });
  };

  const handleSpeedChange = (value: string) => {
    setSpeed(value);
    controlMutate({
      device_id: deviceId,
      channel_id: channelId,
      action: "scale",
      scale: parseFloat(value),
    });
  };

  const isPending = isStartPending || isStopPending || isControlPending;

  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div className="text-sm font-medium">录像回放</div>

      {/* 时间选择 */}
      <div className="space-y-2">
        <Label className="text-xs">开始时间</Label>
        <Input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          disabled={isPlaying}
          className="h-8"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">结束时间</Label>
        <Input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          disabled={isPlaying}
          className="h-8"
        />
      </div>

      {/* 开始/停止回放 */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant={isPlaying ? "outline" : "default"}
          onClick={handleStartPlayback}
          disabled={isPending || isPlaying}
        >
          <Play className="h-4 w-4 mr-1" />
          开始回放
        </Button>
        <Button
          size="sm"
          variant={isPlaying ? "destructive" : "outline"}
          onClick={handleStopPlayback}
          disabled={isPending || !isPlaying}
        >
          <Square className="h-4 w-4 mr-1" />
          停止回放
        </Button>
      </div>

      {/* 播放控制 */}
      {isPlaying && (
        <div className="pt-2 border-t space-y-2">
          <Label className="text-xs">播放控制</Label>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePause}
              disabled={isPending}
            >
              <Pause className="h-4 w-4 mr-1" />
              暂停
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePlay}
              disabled={isPending}
            >
              <Play className="h-4 w-4 mr-1" />
              继续
            </Button>
          </div>

          {/* 倍速控制 */}
          <div className="space-y-2">
            <Label className="text-xs">播放倍速</Label>
            <Select value={speed} onValueChange={handleSpeedChange}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
                <SelectItem value="4">4x</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
