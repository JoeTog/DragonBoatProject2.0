export interface MsgTaskRecover {
    taskIndex: number;
    duration: number;
    targetSwipes: number;
    currentSwipes: number;
    remainingTime: number;
    /** 任务状态 */
    status: 'active' | 'rest' | 'completed' | 'failed' | 'eliminated';  // eliminated: 已淘汰
}
