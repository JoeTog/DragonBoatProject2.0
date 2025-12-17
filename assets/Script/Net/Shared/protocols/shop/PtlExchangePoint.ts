import { BaseRequest, BaseResponse, BaseConf } from "../base";
/** 兑换点券 */
export interface ReqExchangePoint extends BaseRequest {
    /**兑换数量 */
    count: number;
}

export interface ResExchangePoint extends BaseResponse {
    /**兑换后积分 */
    game_coin: number;
    /**兑换后点券 */
    point: number;
    /**【09-10】兑换后战斗力 */
    power: number;
    /**【11-13】冻结的武力值 */
    freezePower: number;
}

export const conf: BaseConf = {
    needLogin: true,
}