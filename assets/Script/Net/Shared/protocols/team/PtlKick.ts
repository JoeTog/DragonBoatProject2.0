import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**踢出玩家 */
export interface ReqKick extends BaseRequest {
    /**被踢出的玩家id */
    uid: number;
}

export interface ResKick extends BaseResponse {
    
}

export const conf: BaseConf = {
    needLogin: true,
}