import { BaseConf, BaseRequest, BaseResponse } from "../base";

export interface ReqGetTaskMessages extends BaseRequest {
}

export interface TaskMessageDto {
  id: number;
  type: string;
  content: string;
  is_read: number;
  /** 时间戳（毫秒） */
  created_at: number;
}

export interface ResGetTaskMessages extends BaseResponse {
  list: TaskMessageDto[];
}

export const conf: BaseConf = {
  needLogin: true,
};
