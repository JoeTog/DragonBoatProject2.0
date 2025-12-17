/**
 * 任务完成消息
 */
export interface MsgTaskComplete {
  /** 是否成功完成 */
  success: boolean;
  /** 获得的战斗力 */
  earnedPower: number;
  /** 休息时长（秒） */
  restDuration: number;
}
