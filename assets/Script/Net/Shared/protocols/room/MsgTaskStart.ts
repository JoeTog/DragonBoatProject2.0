/**
 * 任务开始消息
 */
export interface MsgTaskStart {
  /** 第几个任务 */
  taskIndex: number;
  /** 任务时长（秒） */
  duration: number;
  /** 目标滑动次数 */
  targetSwipes: number;
}
