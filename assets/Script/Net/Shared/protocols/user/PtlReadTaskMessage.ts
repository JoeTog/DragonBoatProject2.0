import { BaseConf, BaseRequest, BaseResponse } from "../base";

export interface ReqReadTaskMessage extends BaseRequest {
  /** 要标记为已读的消息ID列表 */
  ids: number[];
}

export interface ResReadTaskMessage extends BaseResponse {
}

export const conf: BaseConf = {
  needLogin: true,
};
