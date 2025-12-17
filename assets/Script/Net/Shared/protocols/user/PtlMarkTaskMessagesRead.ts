import { BaseConf, BaseRequest, BaseResponse } from "../base";

export interface ReqMarkTaskMessagesRead extends BaseRequest {
}

export interface ResMarkTaskMessagesRead extends BaseResponse {
}

export const conf: BaseConf = {
  needLogin: true,
};
