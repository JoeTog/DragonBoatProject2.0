import { BaseConf, BaseRequest, BaseResponse } from "../base";

/**
 * 获取淘汰记录（只返回淘汰冻结记录）
 */
export interface ReqGetEliminationRecords extends BaseRequest {
    page?: number; // 页码（从1开始，默认1）
    pageSize?: number; // 每页数量（默认100，最大100）
    unfreezeStatus?: 'can_unfreeze' | 'unfreezing' | 'unfrozen' | 'expired' | 'cancelled' | 'can_revive' | 'revived'; // 筛选解冻状态（可选，不传则返回所有状态的淘汰记录）
}

export interface ResGetEliminationRecords extends BaseResponse {
    list: Array<{
        id: number; // 记录ID
        type: 'freeze'; // 类型（固定为freeze）
        operationType: 'elimination'; // 操作类型（固定为elimination）
        amount: number; // 武力值变化数量（负数，表示冻结的武力值）
        reason: string; // 详细原因
        time: number; // 时间戳（Unix时间戳）
        unfreezeStatus: 'can_unfreeze' | 'unfreezing' | 'unfrozen' | 'expired' | 'cancelled' | 'can_revive' | 'revived'; // 解冻状态
        freezeAmount: number; // 冻结的武力值数量（amount的绝对值）
    }>;
    total: number; // 总记录数
    page: number; // 当前页码
    pageSize: number; // 每页数量
}

export const conf: BaseConf = {
    needLogin: true,
}

