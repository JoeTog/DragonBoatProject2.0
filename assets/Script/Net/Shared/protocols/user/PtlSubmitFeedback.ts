import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**
 * 提交反馈/建议
 */
export interface ReqSubmitFeedback extends BaseRequest {
    /** 反馈内容 */
    content: string;
    /** 联系方式（可选，用于发奖联系） */
    contact?: string;
}

export interface ResSubmitFeedback extends BaseResponse {
    /** 反馈ID */
    feedbackId: number;
}

export const conf: BaseConf = {
    needLogin: true,
}
