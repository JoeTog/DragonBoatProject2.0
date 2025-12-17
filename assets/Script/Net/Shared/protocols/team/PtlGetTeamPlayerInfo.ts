import { IPlayer, IUser } from "../../models/Interfaces";
import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**获取玩家信息请求 */
export interface ReqGetTeamPlayerInfo extends BaseRequest {
    uid:number
}

/**获取玩家信息响应 */
export interface ResGetTeamPlayerInfo extends BaseResponse {
    info:IUser & IPlayer
}

export const conf: BaseConf = {
    needLogin: true,
}