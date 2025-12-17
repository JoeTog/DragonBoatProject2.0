import { BaseRequest, BaseResponse, BaseConf } from "../base";
/** 购买道具 */
export interface ReqBuyItem extends BaseRequest {
    /**道具ID */
    id: number;
}

export interface ResBuyItem extends BaseResponse {
    
}

export const conf: BaseConf = {
    needLogin: true,
}