import { BaseConf, BaseRequest, BaseResponse} from '../base';

/**
 * 登录请求
 */
export interface ReqLogin extends BaseRequest {
    /**
     * 账号
     */
    account: string,
    /**
     * 密码
     */
    password: string
}

/**
 * 登录响应
 */
export interface ResLogin extends BaseResponse {
    /**
     * 令牌
     */
    __ssoToken: string;
}

export const conf: BaseConf = {

};