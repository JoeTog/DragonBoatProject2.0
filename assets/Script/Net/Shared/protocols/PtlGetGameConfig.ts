import { BaseConf, BaseRequest, BaseResponse } from "./base";

/**获取游戏配置 */
export interface ReqGetGameConfig extends BaseRequest {

}

/**获取游戏配置响应 */
export interface ResGetGameConfig extends BaseResponse {
    /**游戏公告 */
    game_notice: string;
    /**游戏说明 */
    game_desc: string;
    /**匹配开始小时（默认10） */
    match_start_hour: number;
    /**匹配结束小时（默认20） */
    match_end_hour: number;
    /**允许匹配的星期数组（0=周日, 1=周一, ..., 6=周六，默认[1,2,3,4,5]表示周一到周五） */
    match_allowed_days: number[];
}

export const conf: BaseConf = {

}

