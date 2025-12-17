import { ITeam } from "../../models/Interfaces";
import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**
 * 获取队伍信息请求
 */
export interface ReqGetTeamInfo extends BaseRequest {

}

export interface ResGetTeamInfo extends BaseResponse {
    /**
     * 是否有队伍（明确标识）
     */
    hasTeam: boolean
    /**
     * 队伍信息（总是返回，不在队伍时为空对象）
     */
    info: ITeam
}

export const conf: BaseConf = {
    needLogin: true,
}