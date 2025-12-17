/**
 * 任务倒计时消息
 */
export interface MsgTaskCountdown {
  /** 任务索引 */
  taskIndex: number;
  /** 剩余时间（秒） */
  remainingTime: number;
  /** 任务状态 */
  status: 'active' | 'rest' | 'completed' | 'failed' | 'eliminated';  // eliminated: 已淘汰
  /** 当前滑动次数 */
  currentSwipes: number;
  /** 目标滑动次数 */
  targetSwipes: number;
}
