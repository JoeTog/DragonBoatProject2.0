import { BaseConf, BaseRequest, BaseResponse } from "../base";

/**
 * 获取武力值变化记录
 */
export interface ReqGetPowerRecord extends BaseRequest {
    page?: number; // 页码（从1开始，默认1）
    pageSize?: number; // 每页数量（默认20，最大100）
}

export interface ResGetPowerRecord extends BaseResponse {
    list: Array<{
        id: number; // 记录ID
        type: 'freeze' | 'reduce' | 'increase' | 'elimination'; // 类型
        operationType: 'team_fail' | 'elimination' | 'exchange_point' | 'unfreeze' | 'revival'; // 操作类型
        amount: number; // 武力值变化数量（正数表示增加，负数表示减少/冻结）
        reason: string; // 详细原因
        time: number; // 时间戳（Unix时间戳）
        unfreezeStatus?: 'can_unfreeze' | 'unfreezing' | 'unfrozen' | 'expired' | 'cancelled' | 'can_revive' | 'revived'; // 解冻状态（仅淘汰冻结记录有此字段）
        freezeAmount?: number; // 冻结的武力值数量（amount的绝对值）
    }>;
    total: number; // 总记录数
    page: number; // 当前页码
    pageSize: number; // 每页数量
}

export const conf: BaseConf = {
    needLogin: true,
}

