import { BaseRequest, BaseResponse, BaseConf } from "../base";
import { EnrichedBagItem } from "../../models/Interfaces";

/**【08-28】使用道具 */
export interface ReqUseItem extends BaseRequest {
    /**道具ID */
    id: number;
}

export interface ResUseItem extends BaseResponse {
    /**背包数据（按道具ID分组，显示数量） */
    bag_data: EnrichedBagItem[];
    /**是否淘汰 0否 1是 */
    isdie: number;
    /**冻结武力值 */
    freezePower?: number;
    /**提示信息 */
    msg: string;
}

export const conf: BaseConf = {
    needLogin: true,
}
