import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**
 * 【08-18】获取游戏状态
 */
export interface ReqGetStatus extends BaseRequest {
    
}

/**
 * 获取状态
 */
export interface ResGetStatus extends BaseResponse {
    /**
     * 队伍ID
     */
    teamId:number;
    /**
     * 房间ID
     */
    roomId:number;
    /**
     * 任务状态（可选）
     */
    taskState?: {
        taskIndex: number;
        duration: number;
        targetSwipes: number;
        currentSwipes: number;
        remainingTime: number;
        status: 'active' | 'rest' | 'completed' | 'failed' | 'eliminated';  // eliminated: 已淘汰
    };
}

export const conf: BaseConf = {
    needLogin: true,
}