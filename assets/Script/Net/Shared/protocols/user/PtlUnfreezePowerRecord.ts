import { BaseRequest, BaseResponse, BaseConf } from "../base";
import { EnrichedBagItem } from "../../models/Interfaces";

/**
 * 解冻淘汰记录
 */
export interface ReqUnfreezePowerRecord extends BaseRequest {
    /**power_record的ID */
    recordId: number;
}

export interface ResUnfreezePowerRecord extends BaseResponse {
    /**实际解冻的武力值数量 */
    unfreezedAmount: number;
    /**解冻后的武力值 */
    newPower: number;
    /**解冻后的冻结武力值 */
    newFreezePower: number;
    /**复活后的淘汰状态（应该是0） */
    isdie: number;
    /**更新后的背包数据 */
    bag_data: EnrichedBagItem[];
}

export const conf: BaseConf = {
    needLogin: true,
}

