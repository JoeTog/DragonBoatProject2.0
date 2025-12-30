import { BaseConf, BaseRequest, BaseResponse } from "../base";

/** 标记公告已读 */
export interface ReqMarkNoticeRead extends BaseRequest {}

export interface ResMarkNoticeRead extends BaseResponse {}

export const conf: BaseConf = {
  needLogin: true
};
