import { IPlayer, IUser } from "../../models/Interfaces";
import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**
 * 获取玩家信息请求
 */
export interface ReqGetInfo extends BaseRequest {

}

export interface ResGetInfo extends BaseResponse {
    /**
     * 玩家信息（bag_data 已经是 EnrichedBagItem[] 格式，包含完整道具信息）
     */
    info: IUser & IPlayer
    /**【09-02】游戏生效的道具 */
    gameItems:number[];
}

export const conf: BaseConf = {
    needLogin: true,
}
