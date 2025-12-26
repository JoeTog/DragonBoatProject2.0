/**
 * 执行道具合成
 */

export interface ReqDoSynthesis {
    /** 目标合成道具ID */
    targetItemId: number;
}

export interface ResSynthesisResult {
    /** 道具ID */
    itemId: number;
    /** 道具名称 */
    itemName: string;
    /** 数量 */
    count: number;
}

export interface ResDoSynthesis {
    /** 合成是否成功 */
    success: boolean;
    /** 结果道具 */
    resultItem: ResSynthesisResult;
    /** 结果消息 */
    msg: string;
}
