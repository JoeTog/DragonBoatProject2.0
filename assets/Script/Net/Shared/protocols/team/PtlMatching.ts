import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**【08-13】开始匹配 只有队长可以调用 */
export interface ReqMatching extends BaseRequest {
    
}

export interface ResMatching extends BaseResponse {
    
}

export const conf: BaseConf = {
    needLogin: true,
}