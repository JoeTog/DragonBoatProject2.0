/**
 * 任务进度消息
 */
export interface MsgTaskProgress {
  /** 当前滑动次数 */
  currentSwipes: number;
  /** 目标滑动次数 */
  targetSwipes: number;
  /** 剩余时间（秒） */
  remainingTime: number;
  /** 任务是否已完成（可选，用于任务完成后但时间未到的情况） */
  isCompleted?: boolean;
}
