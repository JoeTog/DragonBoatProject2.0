import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**【08-13】取消匹配 */
export interface ReqCancelMatching extends BaseRequest {
}

export interface ResCancelMatching extends BaseResponse {
}

export const conf: BaseConf = {
    needLogin: true,
} 