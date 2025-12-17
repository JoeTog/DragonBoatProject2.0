/**
 * 任务结束消息
 */
export interface MsgTaskEnd {
  /** 任务索引 */
  taskIndex: number;
  /** 是否成功完成 */
  success: boolean;
  /** 结束原因 */
  reason: 'completed' | 'timeout' | 'failed';
  /** 最终滑动次数 */
  finalSwipes: number;
  /** 目标滑动次数 */
  targetSwipes: number;
  /** 获得的战斗力 */
  earnedPower?: number;
}
