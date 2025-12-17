export interface MsgTaskRecover {
    taskIndex: number;
    duration: number;
    targetSwipes: number;
    currentSwipes: number;
    remainingTime: number;
    status: 'active' | 'rest' | 'failed';
}
