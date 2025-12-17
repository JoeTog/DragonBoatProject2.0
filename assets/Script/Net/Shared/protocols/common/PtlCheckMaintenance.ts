import { BaseConf, BaseRequest, BaseResponse } from "../base";

/**检查组队维护状态 */
export interface ReqCheckMaintenance extends BaseRequest {

}

/**检查组队维护状态响应 */
export interface ResCheckMaintenance extends BaseResponse {
    /**是否在维护状态：true=维护中，false=未维护 */
    isMaintenance: boolean;
    /**维护描述信息（仅在维护时返回），包含周几和维护时间 */
    maintenanceMessage?: string;
}

export const conf: BaseConf = {
    needLogin: false
}

