import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**
 * 加入队伍请求
 */
export interface ReqJoinTeam extends BaseRequest {
    id: number;
    /**
     * 队伍密码（可选，仅在队伍有密码时必填）
     */
    password?: string;
}

/**
 * 加入队伍响应
 */
export interface ResJoinTeam extends BaseResponse {
}

export const conf: BaseConf = {
    needLogin: true,
}
