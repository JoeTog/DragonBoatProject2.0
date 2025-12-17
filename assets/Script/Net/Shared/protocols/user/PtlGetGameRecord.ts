import { IGameRecord } from "../../models/Interfaces";
import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**【08-18】获取游戏记录，如果传了uid，则获取指定uid的记录，如果没有，查询自己的 */
export interface ReqGetGameRecord extends BaseRequest {
    uid?:number;
}

export interface ResGetGameRecord extends BaseResponse {
    list:IGameRecord[]
}

export const conf: BaseConf = {
    needLogin: true,
}