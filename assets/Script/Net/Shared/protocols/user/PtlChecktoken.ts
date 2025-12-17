import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**
 * 验证token请求
 */
export interface ReqChecktoken extends BaseRequest {
    
}

export interface ResChecktoken extends BaseResponse {
    /**
     * 验证结果
     */
    result: boolean
}

export const conf: BaseConf = {
   
}