import { BaseConf, BaseRequest, BaseResponse } from "../base";

/**
 * 获取队长匹配次数（用于队长专属福利活动）
 */
export interface ReqGetCaptainMatchCount extends BaseRequest {
    version?: string; // 版本号，默认'1.0'
}

export interface ResGetCaptainMatchCount extends BaseResponse {
    matchCount: number; // 匹配次数
    version: string; // 版本号
}

export const conf: BaseConf = {
    needLogin: true,
}
