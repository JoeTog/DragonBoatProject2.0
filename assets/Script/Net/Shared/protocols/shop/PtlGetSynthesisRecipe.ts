/**
 * 查询合成配方
 */

export interface ReqGetSynthesisRecipe {
    /** 目标合成道具ID */
    targetItemId: number;
}

export interface SynthesisMaterial {
    /** 材料道具ID */
    itemId: number;
    /** 材料道具名称 */
    itemName: string;
    /** 所需数量 */
    count: number;
    /** 玩家当前拥有数量 */
    owned: number;
}

export interface SynthesisResultItem {
    /** 合成结果道具ID */
    itemId: number;
    /** 合成结果道具名称 */
    itemName: string;
    /** 合成产出数量 */
    count: number;
}

export interface SynthesisRecipe {
    /** 材料列表 */
    materials: SynthesisMaterial[];
    /** 合成结果 */
    resultItem: SynthesisResultItem;
    /** 合成成功率(百分比) */
    successRate: number;
}

export interface ResGetSynthesisRecipe {
    /** 是否可合成 */
    canSynthesize: boolean;
    /** 合成配方（可合成时返回） */
    recipe?: SynthesisRecipe;
    /** 提示信息（不可合成时返回） */
    msg?: string;
}
