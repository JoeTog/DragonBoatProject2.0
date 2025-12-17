import { BaseRequest, BaseResponse, BaseConf } from "../base";
import { EnrichedBagItem } from "../../models/Interfaces";

/**【08-28】合并道具 */
export interface ReqMergeItem extends BaseRequest {
    /**合成器在背包中的位置 */
    index0: number;
    /**道具1在背包中的位置 */
    index1: number;
    /**道具2在背包中的位置 */
    index2: number;
}

export interface ResMergeItem extends BaseResponse {
    /**背包数据（按道具ID分组，显示数量） */
    bag_data: EnrichedBagItem[];
}

export const conf: BaseConf = {

}
