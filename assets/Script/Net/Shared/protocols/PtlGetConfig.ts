import { BaseRequest, BaseResponse, BaseConf } from "./base";

/**【08-18】获取配置 */
export interface ReqGetConfig extends BaseRequest {
    
}

/**【08-18】获取配置响应 */
export interface ResGetConfig extends BaseResponse {
    /**游戏说明 */
    game_desc:string;
}

export const conf: BaseConf = {
    
}