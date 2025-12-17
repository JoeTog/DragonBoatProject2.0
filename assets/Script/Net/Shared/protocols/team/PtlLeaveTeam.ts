import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**
 * 离开队伍请求
 */
export interface ReqLeaveTeam extends BaseRequest {

}

/**
 * 离开队伍响应
 */
export interface ResLeaveTeam extends BaseResponse {
    
}

export const conf: BaseConf = {
    needLogin: true,
}