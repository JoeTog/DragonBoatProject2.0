import { ITeamBase } from "../../models/Interfaces";
import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**
 * 获取队伍列表请求
 */
export interface ReqGetTeamList extends BaseRequest {

}

/**
 * 获取队伍列表响应
 */
export interface ResGetTeamList extends BaseResponse {
    /**
     * 队伍列表
     */
    teams: ITeamBase[];
    /**
     * 注意：虽然类型是 ITeamBase[]，但实际返回的数据包含以下扩展字段（来自 ITeam）：
     * - onlineCount?: number - 在线人数
     * - totalCount?: number - 总人数
     * - password?: string - 队伍密码（前端不应该显示，仅用于判断是否有密码）
     */
}

export const conf: BaseConf = {
    needLogin: true,
}
