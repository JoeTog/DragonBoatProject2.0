import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**
 * 创建队伍请求
 */
export interface ReqCreateTeam extends BaseRequest {
    /**
     * 队伍名称（必填）
     */
    teamName: string;
    /**
     * 队伍密码（可选）
     */
    password?: string;
}

/**
 * 创建队伍响应
 */
export interface ResCreateTeam extends BaseResponse {
    /**
     * 队伍ID
     * 即队长id（创建失败时为0）
     */
    id: number;
    /**
     * 是否在队伍中
     */
    inTeam: boolean;
    /**
     * 是否在游戏中
     */
    inGame: boolean;
    /**
     * 错误信息（可选，仅在业务错误时返回）
     */
    error?: string;
}

export const conf: BaseConf = {
    needLogin: true,
}
