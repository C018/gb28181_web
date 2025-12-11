import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Circle, Square } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  StartRecord,
  StopRecord,
  GetRecordStatus,
} from "~/service/api/record/record";
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

interface RecordControlPanelProps {
  app: string;
  stream: string;
}

export default function RecordControlPanel({
  app,
  stream,
}: RecordControlPanelProps) {
  const [recordType, setRecordType] = useState(1); // 0: HLS, 1: MP4

  // 查询录像状态
  const { data: statusData, refetch: refetchStatus } = useQuery({
    queryKey: ["record-status", app, stream, recordType],
    queryFn: () => GetRecordStatus({ app, stream, type: recordType }),
    refetchInterval: 5000, // 每5秒刷新一次状态
  });

  const isRecording = statusData?.data?.status || false;

  // 开始录像
  const { mutate: startMutate, isPending: isStartPending } = useMutation({
    mutationFn: StartRecord,
    onSuccess: () => {
      toastSuccess("录像已开始");
      refetchStatus();
    },
    onError: ErrorHandle,
  });

  // 停止录像
  const { mutate: stopMutate, isPending: isStopPending } = useMutation({
    mutationFn: StopRecord,
    onSuccess: () => {
      toastSuccess("录像已停止");
      refetchStatus();
    },
    onError: ErrorHandle,
  });

  const handleStartRecord = () => {
    startMutate({
      app,
      stream,
      type: recordType,
      max_second: 3600, // 1小时切片
    });
  };

  const handleStopRecord = () => {
    stopMutate({
      app,
      stream,
      type: recordType,
    });
  };

  const isPending = isStartPending || isStopPending;

  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div className="text-sm font-medium">录像控制</div>

      {/* 录像类型选择 */}
      <div className="space-y-2">
        <Label className="text-xs">录像类型</Label>
        <Select
          value={recordType.toString()}
          onValueChange={(v) => setRecordType(Number(v))}
          disabled={isRecording}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">HLS</SelectItem>
            <SelectItem value="1">MP4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 状态显示 */}
      <div className="flex items-center space-x-2">
        <div
          className={`h-3 w-3 rounded-full ${
            isRecording ? "bg-red-500 animate-pulse" : "bg-gray-300"
          }`}
        />
        <span className="text-xs text-gray-600">
          {isRecording ? "录像中" : "未录像"}
        </span>
      </div>

      {/* 控制按钮 */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant={isRecording ? "outline" : "default"}
          onClick={handleStartRecord}
          disabled={isPending || isRecording}
        >
          <Circle className="h-4 w-4 mr-1" />
          开始录像
        </Button>
        <Button
          size="sm"
          variant={isRecording ? "destructive" : "outline"}
          onClick={handleStopRecord}
          disabled={isPending || !isRecording}
        >
          <Square className="h-4 w-4 mr-1" />
          停止录像
        </Button>
      </div>
    </div>
  );
}
