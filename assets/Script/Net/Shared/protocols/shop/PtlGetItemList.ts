import { IShopItem } from "../../models/Interfaces";
import { BaseRequest, BaseResponse, BaseConf } from "../base";

/** 获取道具列表 */
export interface ReqGetItemList extends BaseRequest {
    
}

export interface ResGetItemList extends BaseResponse {
    /**道具列表 */
    items: IShopItem[];
}



export const conf: BaseConf = {
    needLogin: true,
}